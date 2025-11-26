<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function myOrders()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)
            ->whereIn('status', ['reserved','ongoing','cancelled'])
            ->orderByDesc('created_at')
            ->with(['items.vehicle.brand:id,name','items.vehicle.vehicleClass:id,name'])
            ->get();
        return Inertia::render('user/orders/index', ['orders' => $orders]);
    }

    public function history()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)
            ->where('status', 'closed')
            ->orderByDesc('created_at')
            ->with(['items.vehicle.brand:id,name','items.vehicle.vehicleClass:id,name'])
            ->get();
        return Inertia::render('user/orders/history', ['orders' => $orders]);
    }
}
