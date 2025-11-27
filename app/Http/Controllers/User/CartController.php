<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::forUser($user->id)->load([
            'items.vehicle:id,model,brand_id,vehicle_class_id,production_year,seat_count,transmission,price_daily_idr,price_weekly_idr,price_monthly_idr',
            'items.vehicle.brand:id,name',
            'items.vehicle.vehicleClass:id,name',
        ]);
        return Inertia::render('user/cart/index', [
            'cart' => $cart,
        ]);
    }

    public function storeItem(Request $request)
    {
        $data = $request->validate([
            'vehicle_id' => ['required','integer','exists:vehicles,id'],
            'quantity' => ['nullable','integer','min:1'],
        ]);
        $user = Auth::user();
        $cart = Cart::forUser($user->id);
        $qty = $data['quantity'] ?? 1;
        $vehicleId = (int)$data['vehicle_id'];

        $item = CartItem::where('cart_id', $cart->id)->where('vehicle_id', $vehicleId)->first();
        if ($item) {
            $item->update(['quantity' => $item->quantity + $qty]);
        } else {
            CartItem::create(['cart_id' => $cart->id, 'vehicle_id' => $vehicleId, 'quantity' => $qty]);
        }

        return redirect()->back()->with('success', 'Added to cart');
    }

    public function destroyItem(CartItem $item)
    {
        $user = Auth::user();
        $cart = Cart::forUser($user->id);
        if ($item->cart_id !== $cart->id) { abort(403); }
        $item->delete();
        return redirect()->back()->with('success', 'Removed from cart');
    }

    public function destroyByVehicle(Vehicle $vehicle)
    {
        $user = Auth::user();
        $cart = Cart::forUser($user->id);
        $item = CartItem::where('cart_id', $cart->id)->where('vehicle_id', $vehicle->id)->first();
        if (!$item) {
            return redirect()->back()->with('success', 'Nothing to remove');
        }
        $item->delete();
        return redirect()->back()->with('success', 'Removed from cart');
    }

    public function updateConfigByVehicle(Request $request, Vehicle $vehicle)
    {
        $data = $request->validate([
            'time_type' => ['required','in:daily,weekly,monthly'],
            'duration_units' => ['nullable','integer','min:1'],
            'start_at' => ['nullable','date'],
        ]);
        $user = Auth::user();
        $cart = Cart::forUser($user->id);
        $item = CartItem::where('cart_id', $cart->id)->where('vehicle_id', $vehicle->id)->first();
        if (!$item) {
            return redirect()->back()->withErrors(['item' => 'Item not found']);
        }
        $item->update([
            'time_type' => $data['time_type'],
            'duration_units' => $data['duration_units'] ?? 1,
            'start_at' => $data['start_at'] ?? $item->start_at,
        ]);
        return redirect()->back()->with('success', 'Configuration updated');
    }
}
