<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    protected $casts = [
        'quantity' => 'integer',
        'price_per_unit_idr' => 'integer',
        'subtotal_price_idr' => 'integer',
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function rentalOrder(): BelongsTo
    {
        return $this->belongsTo(RentalOrder::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function scopeDaily($query)
    {
        return $query->where('mode', 'daily');
    }

    public function scopeWeekly($query)
    {
        return $query->where('mode', 'weekly');
    }

    public function scopeMonthly($query)
    {
        return $query->where('mode', 'monthly');
    }

    public function getDurationDays(): int
    {
        return $this->start_at->diffInDays($this->end_at);
    }

    public function getDurationWeeks(): float
    {
        return $this->getDurationDays() / 7;
    }

    public function getDurationMonths(): float
    {
        return $this->getDurationDays() / 30;
    }

    public function isOverlapping(self $other): bool
    {
        return $this->start_at < $other->end_at && $this->end_at > $other->start_at;
    }

    public function overlapsWithOtherActiveItems(): bool
    {
        return $this->vehicle
            ->rentalOrderItems()
            ->whereHas('rentalOrder', function ($query) {
                $query->whereIn('status', ['draft', 'ongoing']);
            })
            ->where('id', '!=', $this->id)
            ->where(function ($query) {
                $query->where('start_at', '<', $this->end_at)
                      ->where('end_at', '>', $this->start_at);
            })
            ->exists();
    }
}
