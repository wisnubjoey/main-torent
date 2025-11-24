<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RentalOrder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RentalOrderHistoryController extends Controller
{
    /**
     * Display completed and cancelled orders with filters.
     */
    public function index(Request $request): Response
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'user' => 'nullable|string|max:255',
            'status' => 'nullable|in:completed,cancelled',
            'vehicle_count_min' => 'nullable|integer|min:1',
            'vehicle_count_max' => 'nullable|integer|min:vehicle_count_min',
        ]);

        $query = RentalOrder::with([
            'user:id,name,phone',
            'items.vehicle:id,model,plate_no',
            'items.vehicle.brand:id,name',
            'items.vehicle.vehicleClass:id,name'
        ])->whereIn('status', ['completed', 'cancelled']);

        // Apply filters
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('user')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->user . '%')
                  ->orWhere('phone', 'like', '%' . $request->user . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('vehicle_count_min')) {
            $query->whereHas('items', function ($q) use ($request) {
                $q->selectRaw('rental_order_id, COUNT(*) as vehicle_count')
                  ->groupBy('rental_order_id')
                  ->havingRaw('COUNT(*) >= ?', [$request->vehicle_count_min]);
            });
        }

        if ($request->filled('vehicle_count_max')) {
            $query->whereHas('items', function ($q) use ($request) {
                $q->selectRaw('rental_order_id, COUNT(*) as vehicle_count')
                  ->groupBy('rental_order_id')
                  ->havingRaw('COUNT(*) <= ?', [$request->vehicle_count_max]);
            });
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'user' => [
                        'id' => $order->user->id,
                        'name' => $order->user->name,
                        'phone' => $order->user->phone,
                    ],
                    'status' => $order->status,
                    'total_price_idr' => $order->total_price_idr,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at->toISOString(),
                    'updated_at' => $order->updated_at->toISOString(),
                    'vehicle_count' => $order->items->count(),
                    'period' => $this->getOrderPeriod($order),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'vehicle' => [
                                'id' => $item->vehicle->id,
                                'model' => $item->vehicle->model,
                                'plate_no' => $item->vehicle->plate_no,
                                'brand' => optional($item->vehicle->brand)->name ?? '',
                                'vehicle_class' => optional($item->vehicle->vehicleClass)->name ?? '',
                            ],
                            'mode' => $item->mode,
                            'quantity' => $item->quantity,
                            'start_at' => $item->start_at->toISOString(),
                            'end_at' => $item->end_at->toISOString(),
                            'price_per_unit_idr' => $item->price_per_unit_idr,
                            'subtotal_price_idr' => $item->subtotal_price_idr,
                        ];
                    }),
                ];
            });

        // Get filter summary stats
        $stats = [
            'total_orders' => $query->count(),
            'completed_orders' => RentalOrder::where('status', 'completed')->count(),
            'cancelled_orders' => RentalOrder::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('admin/orders/history', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only([
                'date_from',
                'date_to', 
                'user',
                'status',
                'vehicle_count_min',
                'vehicle_count_max'
            ]),
        ]);
    }

    /**
     * Get order period description.
     */
    private function getOrderPeriod(RentalOrder $order): string
    {
        if ($order->items->isEmpty()) {
            return 'No items';
        }

        $startDates = $order->items->pluck('start_at')->sort();
        $endDates = $order->items->pluck('end_at')->sort();

        return $startDates->first()->format('M d, Y') . ' - ' . $endDates->last()->format('M d, Y');
    }
}
