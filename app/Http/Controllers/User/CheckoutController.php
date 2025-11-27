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
        $user = Auth::user();
        $cart = Cart::forUser($user->id)->load(['items.vehicle']);
        if ($cart->items->isEmpty()) { return redirect()->back()->withErrors(['cart' => 'Cart is empty']); }

        $today = Carbon::today();
        $computedStart = null;
        $computedEnd = null;

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'reserved',
                'time_type' => 'daily',
                'duration_units' => 1,
                'start_at' => $today,
                'end_at' => $today,
                'total_amount_idr' => 0,
            ]);

            foreach ($cart->items as $ci) {
                $vehicle = $ci->vehicle;
                $tt = $ci->time_type ?? 'daily';
                $du = (int)($ci->duration_units ?? 1);
                $start = $ci->start_at ? Carbon::parse($ci->start_at) : $today->copy();
                $unit = match ($tt) {
                    'daily' => (int)($vehicle->price_daily_idr ?? 0),
                    'weekly' => (int)($vehicle->price_weekly_idr ?? 0),
                    'monthly' => (int)($vehicle->price_monthly_idr ?? 0),
                };
                $subtotal = $unit * $du * (int)$ci->quantity;
                OrderItem::create([
                    'order_id' => $order->id,
                    'vehicle_id' => $vehicle->id,
                    'quantity' => (int)$ci->quantity,
                    'unit_price_idr' => $unit,
                    'subtotal_idr' => $subtotal,
                ]);

                $itemEnd = match ($tt) {
                    'daily' => $start->copy()->addDays($du),
                    'weekly' => $start->copy()->addWeeks($du),
                    'monthly' => $start->copy()->addMonths($du),
                };
                if ($computedStart === null || $start->lt($computedStart)) {
                    $computedStart = $start->copy();
                }
                if ($computedEnd === null || $itemEnd->gt($computedEnd)) {
                    $computedEnd = $itemEnd->copy();
                }
            }

            $order->start_at = $computedStart ?? $today;
            $order->end_at = $computedEnd ?? $today;
            $order->save();

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
