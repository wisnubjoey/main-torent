<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'total_price_idr',
        'notes',
    ];

    protected $casts = [
        'total_price_idr' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(RentalOrderItem::class);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['draft', 'ongoing']);
    }

    public function isFinalized(): bool
    {
        return in_array($this->status, ['completed', 'cancelled']);
    }

    public function canBeStarted(): bool
    {
        return $this->status === 'draft';
    }

    public function canBeCompleted(): bool
    {
        return $this->status === 'ongoing';
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['draft', 'ongoing']);
    }
}
