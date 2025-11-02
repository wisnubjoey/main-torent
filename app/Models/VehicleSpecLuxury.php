<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleSpecLuxury extends Model {
    public $timestamps = false;
    protected $table = 'vehicle_spec_luxury';
    protected $primaryKey = 'vehicle_id';
    public $incrementing = false;
    protected $fillable = ['vehicle_id','body','driver_included'];
}