<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    /**
     * Display vehicles for rental with cart functionality.
     */
    public function index(): Response
    {
        $vehicles = Vehicle::with(['brand:id,name', 'vehicleClass:id,name'])
            ->where('status', 'active')
            ->get()
            ->map(function ($vehicle) {
                return [
                    'id' => $vehicle->id,
                    'vehicle_type' => $vehicle->vehicle_type,
                    'vehicle_class' => optional($vehicle->vehicleClass)->name ?? '',
                    'brand' => optional($vehicle->brand)->name ?? '',
                    'model' => $vehicle->model,
                    'production_year' => $vehicle->production_year,
                    'seat_count' => $vehicle->seat_count,
                    'transmission' => $vehicle->transmission,
                    'image_url' => $vehicle->primary_image_path ? asset('storage/'.$vehicle->primary_image_path) : null,
                    'primary_image_alt' => $vehicle->primary_image_alt,
                    // Pricing fields in IDR
                    'price_daily_idr' => $vehicle->price_daily_idr,
                    'price_weekly_idr' => $vehicle->price_weekly_idr,
                    'price_monthly_idr' => $vehicle->price_monthly_idr,
                ];
            });

        return Inertia::render('user/vehicles/index', [
            'vehicles' => $vehicles,
        ]);
    }
}
