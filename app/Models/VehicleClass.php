<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleClass extends Model
{
    public $timestamps = false;
    protected $table = 'vehicle_classes';
    protected $fillable = ['name'];

    public function vehicles() {
        return $this->hasMany(Vehicle::class, 'vehicle_class_id');
    }
}