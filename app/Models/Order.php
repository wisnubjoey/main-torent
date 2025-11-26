<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'time_type',
        'duration_units',
        'start_at',
        'end_at',
        'total_amount_idr',
        'approved_at',
        'completed_at',
        'cancelled_at',
    ];

    protected $casts = [
        'duration_units' => 'integer',
        'total_amount_idr' => 'integer',
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function items(): HasMany { return $this->hasMany(OrderItem::class); }

    public function getIsCompletableAttribute(): bool {
        return $this->end_at instanceof Carbon ? now()->greaterThanOrEqualTo($this->end_at) : false;
    }

    public function recomputeTotals(): void {
        $total = (int) $this->items()->sum('subtotal_idr');
        $this->total_amount_idr = $total;
        $this->save();
    }
}

