<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class OrderHistoryController extends Controller
{
    public function index()
    {
        $orders = Order::where('status', 'closed')->with(['user','items.vehicle'])->orderByDesc('completed_at')->get();
        return Inertia::render('admin/orders/history/index', ['orders' => $orders]);
    }
}

