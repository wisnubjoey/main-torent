<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'vehicle_id',
        'quantity',
        'unit_price_idr',
        'subtotal_idr',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price_idr' => 'integer',
        'subtotal_idr' => 'integer',
    ];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function vehicle(): BelongsTo { return $this->belongsTo(Vehicle::class); }
}

