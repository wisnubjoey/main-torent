<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model {
    protected $fillable = [
        'vehicle_type','vehicle_class','brand','model','production_year','plate_no',
        'seat_count','transmission','engine_spec','status'
    ];
}