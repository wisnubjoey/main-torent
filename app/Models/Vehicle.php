<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Vehicle extends Model {
    public $timestamps = false;
    protected $fillable = [
        'vehicle_type','vehicle_class','brand','model','production_year','plate_no','vin',
        'seat_count','transmission','engine_spec','base_daily_rate','status'
    ];

    // Spesifikasi 1-1 per kelas
    public function vacation(): HasOne { return $this->hasOne(VehicleSpecVacation::class); }
    public function sport(): HasOne { return $this->hasOne(VehicleSpecSport::class); }
    public function luxury(): HasOne { return $this->hasOne(VehicleSpecLuxury::class); }
}