<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleSpecSport extends Model {
    public $timestamps = false;
    protected $table = 'vehicle_spec_sport';
    protected $primaryKey = 'vehicle_id';
    public $incrementing = false;
    protected $fillable = ['vehicle_id','zero_to_100_sec','engine_spec','transmission'];
}
