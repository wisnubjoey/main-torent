
## Relations
@structure/rental-order-item-model

The `RentalOrder` model represents a rental order, which can contain multiple rental order items. It has a status that can be draft, ongoing, completed, or cancelled. It also has helper methods to check the status and possible transitions.

---

'''php
// app/Models/RentalOrder.php

class RentalOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'total_price_idr',
        'notes',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(RentalOrderItem::class);
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['draft', 'ongoing']);
    }

    // ... other methods
}
'''
