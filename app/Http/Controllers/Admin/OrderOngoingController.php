<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class OrderOngoingController extends Controller
{
    public function index()
    {
        $orders = Order::where('status', 'ongoing')->with(['user','items.vehicle'])->orderBy('end_at')->get();
        return Inertia::render('admin/orders/ongoing/index', ['orders' => $orders]);
    }

    public function complete(Order $order)
    {
        if (!$order->is_completable) {
            return redirect()->back()->withErrors(['order' => 'Order not yet completable']);
        }
        $order->update(['status' => 'closed', 'completed_at' => now()]);
        return redirect()->back()->with('success', 'Order completed');
    }
}

