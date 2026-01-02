
## Relations
@structure/rental-order-model

The `RentalOrderItem` model represents an item in a rental order. It contains details about the rented vehicle, the rental mode, quantity, start and end dates, and pricing. It also includes a method to check for overlapping active rental items for the same vehicle.

---

'''php
// app/Models/RentalOrderItem.php

class RentalOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_order_id',
        'vehicle_id',
        'mode',
        'quantity',
        'start_at',
        'end_at',
        'price_per_unit_idr',
        'subtotal_price_idr',
    ];

    public function overlapsWithOtherActiveItems(): bool
    {
        return $this->vehicle
            ->rentalOrderItems()
            ->whereHas('rentalOrder', function ($query) {
                $query->whereIn('status', ['draft', 'ongoing']);
            })
            // ... rest of the query
    }
}
'''
