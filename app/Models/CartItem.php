<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = ['cart_id','vehicle_id','quantity','time_type','duration_units','start_at'];

    protected $casts = [
        'quantity' => 'integer',
        'duration_units' => 'integer',
        'start_at' => 'date',
    ];

    public function cart(): BelongsTo { return $this->belongsTo(Cart::class); }
    public function vehicle(): BelongsTo { return $this->belongsTo(Vehicle::class); }
}
