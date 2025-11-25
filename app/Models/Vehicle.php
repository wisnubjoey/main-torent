<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Brand;
use App\Models\VehicleClass;
use App\Models\VehicleImage;
use App\Models\RentalOrderItem;

class Vehicle extends Model {
    protected $fillable = [
        'vehicle_type','vehicle_class','brand','brand_id','vehicle_class_id','model','production_year','plate_no',
        'seat_count','transmission','engine_spec','status',
        // Pricing fields in IDR
        'price_daily_idr','price_weekly_idr','price_monthly_idr',
        'primary_image_path','primary_image_alt'
    ];

    protected $casts = [
        'price_daily_idr' => 'integer',
        'price_weekly_idr' => 'integer',
        'price_monthly_idr' => 'integer',
    ];

    // Relations
    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function vehicleClass() {
        return $this->belongsTo(VehicleClass::class, 'vehicle_class_id');
    }

    public function images() {
        return $this->hasMany(VehicleImage::class);
    }

    public function rentalOrderItems() {
        return $this->hasMany(RentalOrderItem::class);
    }

    // Helpers
    public function secondaryImagesOrdered() {
        return $this->images()->orderBy('position');
    }

    // Accessors
    public function getImageUrlAttribute(): ?string {
        if (!$this->primary_image_path) return null;
        return asset('storage/'.ltrim($this->primary_image_path, '/'));
    }

    protected static function booted(): void {
        static::deleting(function (Vehicle $vehicle) {
            // Delete all files under vehicles/{id}/ on public disk
            $dir = "vehicles/{$vehicle->id}";
            if (Storage::disk('public')->exists($dir)) {
                Storage::disk('public')->deleteDirectory($dir);
            }
        });
    }
}