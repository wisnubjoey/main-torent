<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class OrderApprovalController extends Controller
{
    public function index()
    {
        $orders = Order::where('status', 'reserved')->with(['user','items.vehicle'])->orderBy('start_at')->get();
        return Inertia::render('admin/orders/approval/index', ['orders' => $orders]);
    }

    public function approve(Order $order)
    {
        $order->update(['status' => 'ongoing', 'approved_at' => now()]);
        return redirect()->back()->with('success', 'Order approved');
    }

    public function cancel(Order $order)
    {
        $order->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        return redirect()->back()->with('success', 'Order cancelled');
    }
}

