<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RentalOrder;
use App\Models\RentalOrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RentalOrderController extends Controller
{
    /**
     * Display draft and ongoing orders.
     */
    public function index(): Response
    {
        $orders = RentalOrder::with([
            'user:id,name,phone',
            'items.vehicle:id,model,plate_no,brand_id,vehicle_class_id',
            'items.vehicle.brand:id,name',
            'items.vehicle.vehicleClass:id,name'
        ])
        ->whereIn('status', ['draft', 'ongoing'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($order) {
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

        return Inertia::render('admin/orders/Approval/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display order details.
     */
    public function show(RentalOrder $order): Response
    {
        $order->load([
            'user:id,name,phone',
            'items.vehicle:id,model,plate_no,brand_id,vehicle_class_id,price_daily_idr,price_weekly_idr,price_monthly_idr',
            'items.vehicle.brand:id,name',
            'items.vehicle.vehicleClass:id,name'
        ]);

        $orderData = [
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
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'vehicle' => [
                        'id' => $item->vehicle->id,
                        'model' => $item->vehicle->model,
                        'plate_no' => $item->vehicle->plate_no,
                        'brand' => optional($item->vehicle->brand)->name ?? '',
                        'vehicle_class' => optional($item->vehicle->vehicleClass)->name ?? '',
                        'current_prices' => [
                            'daily' => $item->vehicle->price_daily_idr,
                            'weekly' => $item->vehicle->price_weekly_idr,
                            'monthly' => $item->vehicle->price_monthly_idr,
                        ],
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

        return Inertia::render('admin/orders/show', [
            'order' => $orderData,
        ]);
    }

    /**
     * Start rental (draft -> ongoing).
     */
    public function start(RentalOrder $order): RedirectResponse
    {
        if (!$order->canBeStarted()) {
            throw ValidationException::withMessages([
                'status' => 'This order cannot be started.',
            ]);
        }

        DB::beginTransaction();
        try {
            // Check availability for all items
            foreach ($order->items as $item) {
                if ($this->isVehicleUnavailable($item->vehicle_id, $item->start_at, $item->end_at, $order->id)) {
                    $vehicle = $item->vehicle;
                    throw new \Exception("Vehicle {$vehicle->model} ({$vehicle->plate_no}) is not available for the selected period.");
                }
            }

            // Update order status
            $order->update(['status' => 'ongoing']);

            DB::commit();

            return back()->with('success', 'Rental started successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'availability' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Complete rental (ongoing -> completed).
     */
    public function complete(RentalOrder $order): RedirectResponse
    {
        if (!$order->canBeCompleted()) {
            throw ValidationException::withMessages([
                'status' => 'This order cannot be completed.',
            ]);
        }

        $order->update(['status' => 'completed']);

        return back()->with('success', 'Rental completed successfully.');
    }

    /**
     * Cancel order (draft/ongoing -> cancelled).
     */
    public function cancel(Request $request, RentalOrder $order): RedirectResponse
    {
        if (!$order->canBeCancelled()) {
            throw ValidationException::withMessages([
                'status' => 'This order cannot be cancelled.',
            ]);
        }

        $request->validate([
            'cancellation_reason' => 'nullable|string|max:1000',
        ]);

        $order->update([
            'status' => 'cancelled',
            'notes' => $order->notes . "\n\nCancelled by admin: " . $request->input('cancellation_reason', 'No reason provided'),
        ]);

        return back()->with('success', 'Order cancelled successfully.');
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

    /**
     * Check if vehicle is unavailable for the given period, excluding a specific order.
     */
    private function isVehicleUnavailable($vehicleId, $startDate, $endDate, $excludeOrderId = null): bool
    {
        return RentalOrderItem::where('vehicle_id', $vehicleId)
            ->whereHas('rentalOrder', function ($query) {
                $query->whereIn('status', ['draft', 'ongoing']);
            })
            ->when($excludeOrderId, function ($query, $excludeOrderId) {
                $query->where('rental_order_id', '!=', $excludeOrderId);
            })
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('start_at', '<', $endDate)
                      ->where('end_at', '>', $startDate);
            })
            ->exists();
    }
}
