<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = ['user_id','status'];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function items(): HasMany { return $this->hasMany(CartItem::class); }

    public static function forUser(int $userId): Cart {
        $cart = static::where('user_id', $userId)->where('status', 'active')->first();
        if (!$cart) { $cart = static::create(['user_id' => $userId, 'status' => 'active']); }
        return $cart;
    }
}

