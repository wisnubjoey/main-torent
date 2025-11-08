<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model {
    protected $fillable = [
        'vehicle_type','vehicle_class','brand','brand_id','vehicle_class_id','model','production_year','plate_no',
        'seat_count','transmission','engine_spec','status'
    ];

    // Relations
    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function vehicleClass() {
        return $this->belongsTo(VehicleClass::class, 'vehicle_class_id');
    }
}