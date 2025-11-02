<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleSpecVacation extends Model {
    public $timestamps = false;
    protected $table = 'vehicle_spec_vacation';
    protected $primaryKey = 'vehicle_id';
    public $incrementing = false;
    protected $fillable = ['vehicle_id','seater','usage','body'];
}
