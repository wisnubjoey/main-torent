<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\RentalOrder;
use App\Models\RentalOrderItem;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RentalCartController extends Controller
{
    /**
     * Add a vehicle to the rental cart.
     */
    public function add(Request $request): RedirectResponse
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
        ]);

        $vehicle = Vehicle::findOrFail($request->vehicle_id);
        
        // Initialize cart if not exists
        $cart = Session::get('rental_cart', []);
        
        // Check if vehicle is already in cart
        if (isset($cart[$vehicle->id])) {
            throw ValidationException::withMessages([
                'vehicle_id' => 'This vehicle is already in your cart.',
            ]);
        }
        
        // Add to cart with default values
        $cart[$vehicle->id] = [
            'vehicle_id' => $vehicle->id,
            'vehicle' => $vehicle->load(['brand:id,name', 'vehicleClass:id,name']),
            'mode' => 'daily',
            'quantity' => 1,
            'start_at' => now()->addDay()->format('Y-m-d\TH:i'),
        ];
        
        Session::put('rental_cart', $cart);
        
        return back()->with('success', 'Vehicle added to cart.');
    }

    /**
     * Update cart item configuration.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'mode' => 'required|in:daily,weekly,monthly',
            'quantity' => 'required|integer|min:1',
            'start_at' => 'required|date|after:now',
        ]);

        $cart = Session::get('rental_cart', []);
        $vehicleId = $request->vehicle_id;
        
        if (!isset($cart[$vehicleId])) {
            throw ValidationException::withMessages([
                'vehicle_id' => 'Vehicle not found in cart.',
            ]);
        }
        
        $vehicle = Vehicle::findOrFail($vehicleId);
        
        // Calculate end_at based on mode and quantity
        $startAt = \Carbon\Carbon::parse($request->start_at);
        $endAt = $this->calculateEndDate($startAt, $request->mode, $request->quantity);
        
        // Check availability
        if ($this->isVehicleUnavailable($vehicleId, $startAt, $endAt)) {
            throw ValidationException::withMessages([
                'start_at' => 'This vehicle is not available for the selected period.',
            ]);
        }
        
        // Update cart item
        $cart[$vehicleId]['mode'] = $request->mode;
        $cart[$vehicleId]['quantity'] = $request->quantity;
        $cart[$vehicleId]['start_at'] = $request->start_at;
        $cart[$vehicleId]['end_at'] = $endAt->format('Y-m-d\TH:i');
        
        // Calculate pricing
        $cart[$vehicleId]['price_per_unit_idr'] = $this->getVehiclePrice($vehicle, $request->mode);
        $cart[$vehicleId]['subtotal_price_idr'] = $cart[$vehicleId]['price_per_unit_idr'] * $request->quantity;
        
        Session::put('rental_cart', $cart);
        
        return back()->with('success', 'Cart updated.');
    }

    /**
     * Remove item from cart.
     */
    public function remove(Request $request): RedirectResponse
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
        ]);

        $cart = Session::get('rental_cart', []);
        $vehicleId = $request->vehicle_id;
        
        if (isset($cart[$vehicleId])) {
            unset($cart[$vehicleId]);
            Session::put('rental_cart', $cart);
        }
        
        return back()->with('success', 'Item removed from cart.');
    }

    /**
     * Process checkout and create rental order.
     */
    public function checkout(Request $request): RedirectResponse
    {
        $cart = Session::get('rental_cart', []);
        
        if (empty($cart)) {
            throw ValidationException::withMessages([
                'cart' => 'Your cart is empty.',
            ]);
        }
        
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);
        
        DB::beginTransaction();
        try {
            // Create rental order
            $order = RentalOrder::create([
                'user_id' => Auth::id(),
                'status' => 'draft',
                'total_price_idr' => 0, // Will calculate below
                'notes' => $validated['notes'],
            ]);
            
            $totalPrice = 0;
            
            // Create rental order items
            foreach ($cart as $item) {
                $startAt = \Carbon\Carbon::parse($item['start_at']);
                $endAt = \Carbon\Carbon::parse($item['end_at']);
                
                // Double-check availability
                if ($this->isVehicleUnavailable($item['vehicle_id'], $startAt, $endAt)) {
                    throw new \Exception("Vehicle {$item['vehicle']['model']} is no longer available.");
                }
                
                RentalOrderItem::create([
                    'rental_order_id' => $order->id,
                    'vehicle_id' => $item['vehicle_id'],
                    'mode' => $item['mode'],
                    'quantity' => $item['quantity'],
                    'start_at' => $startAt,
                    'end_at' => $endAt,
                    'price_per_unit_idr' => $item['price_per_unit_idr'],
                    'subtotal_price_idr' => $item['subtotal_price_idr'],
                ]);
                
                $totalPrice += $item['subtotal_price_idr'];
            }
            
            // Update order total
            $order->update(['total_price_idr' => $totalPrice]);
            
            // Clear cart
            Session::forget('rental_cart');
            
            DB::commit();
            
            return redirect()->route('my-orders')
                ->with('success', 'Rental order created successfully!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            throw ValidationException::withMessages([
                'checkout' => 'Failed to create order: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Display user's rental orders.
     */
    public function myOrders(): Response
    {
        $orders = RentalOrder::with(['items.vehicle:id,model,plate_no', 'user:id,name'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
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
        
        return Inertia::render('user/orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Calculate end date based on rental mode and quantity.
     */
    private function calculateEndDate($startDate, $mode, $quantity): \Carbon\Carbon
    {
        $endDate = $startDate->copy();
        
        switch ($mode) {
            case 'daily':
                $endDate->addDays($quantity);
                break;
            case 'weekly':
                $endDate->addWeeks($quantity);
                break;
            case 'monthly':
                $endDate->addDays(30 * $quantity); // Simplified: 30 days per month
                break;
        }
        
        return $endDate;
    }

    /**
     * Get vehicle price based on rental mode.
     */
    private function getVehiclePrice($vehicle, $mode): int
    {
        switch ($mode) {
            case 'daily':
                return $vehicle->price_daily_idr;
            case 'weekly':
                return $vehicle->price_weekly_idr;
            case 'monthly':
                return $vehicle->price_monthly_idr;
            default:
                throw new \InvalidArgumentException("Invalid rental mode: {$mode}");
        }
    }

    /**
     * Check if vehicle is unavailable for the given period.
     */
    private function isVehicleUnavailable($vehicleId, $startDate, $endDate): bool
    {
        return RentalOrderItem::where('vehicle_id', $vehicleId)
            ->whereHas('rentalOrder', function ($query) {
                $query->whereIn('status', ['draft', 'ongoing']);
            })
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('start_at', '<', $endDate)
                      ->where('end_at', '>', $startDate);
            })
            ->exists();
    }
}
