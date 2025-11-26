<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $cart = Cart::forUser($user->id)->load(['items.vehicle']);
        return Inertia::render('user/checkout/index', [
            'cart' => $cart,
        ]);
    }

    public function applyOrder(Request $request)
    {
        $data = $request->validate([
            'start_at' => ['required','date'],
            'time_type' => ['required','in:daily,weekly,monthly'],
            'duration_units' => ['required','integer','min:1'],
        ]);

        $user = Auth::user();
        $cart = Cart::forUser($user->id)->load(['items.vehicle']);
        if ($cart->items->isEmpty()) { return redirect()->back()->withErrors(['cart' => 'Cart is empty']); }

        $start = Carbon::parse($data['start_at']);
        $end = match ($data['time_type']) {
            'daily' => $start->copy()->addDays($data['duration_units']),
            'weekly' => $start->copy()->addWeeks($data['duration_units']),
            'monthly' => $start->copy()->addMonths($data['duration_units']),
        };

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'reserved',
                'time_type' => $data['time_type'],
                'duration_units' => (int)$data['duration_units'],
                'start_at' => $start,
                'end_at' => $end,
                'total_amount_idr' => 0,
            ]);

            foreach ($cart->items as $ci) {
                $vehicle = $ci->vehicle;
                $unit = match ($data['time_type']) {
                    'daily' => (int)($vehicle->price_daily_idr ?? 0),
                    'weekly' => (int)($vehicle->price_weekly_idr ?? 0),
                    'monthly' => (int)($vehicle->price_monthly_idr ?? 0),
                };
                $subtotal = $unit * (int)$data['duration_units'] * (int)$ci->quantity;
                OrderItem::create([
                    'order_id' => $order->id,
                    'vehicle_id' => $vehicle->id,
                    'quantity' => (int)$ci->quantity,
                    'unit_price_idr' => $unit,
                    'subtotal_idr' => $subtotal,
                ]);
            }

            $order->recomputeTotals();
            $cart->update(['status' => 'converted']);
            DB::commit();
            return redirect()->route('orders.index')->with('success', 'Order created');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['order' => $e->getMessage()]);
        }
    }
}

