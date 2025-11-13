<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VehicleRequest;
use App\Models\Vehicle;
use App\Models\Brand;
use App\Models\VehicleClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Load relations and hydrate UI-friendly fields expected by the frontend
        $vehicles = Vehicle::with(['brand:id,name', 'vehicleClass:id,name'])
            ->get()
            ->map(function ($v) {
                $arr = $v->toArray();
                // Preserve frontend shape: brand and vehicle_class as strings
                $arr['brand'] = optional($v->brand)->name ?? '';
                $arr['vehicle_class'] = optional($v->vehicleClass)->name ?? '';
                // Remove nested relations to keep payload simple
                unset($arr['brand_id'], $arr['vehicle_class_id'], $arr['brand'], $arr['vehicle_class']);
                // Re-add expected fields explicitly
                return [
                    'id' => $v->id,
                    'vehicle_type' => $v->vehicle_type,
                    'vehicle_class' => optional($v->vehicleClass)->name ?? '',
                    'brand' => optional($v->brand)->name ?? '',
                    'model' => $v->model,
                    'production_year' => $v->production_year,
                    'plate_no' => $v->plate_no,
                    'seat_count' => $v->seat_count,
                    'transmission' => $v->transmission,
                    'engine_spec' => $v->engine_spec,
                    // Pricing fields in IDR
                    'price_daily_idr' => $v->price_daily_idr,
                    'price_weekly_idr' => $v->price_weekly_idr,
                    'price_monthly_idr' => $v->price_monthly_idr,
                    'status' => $v->status,
                    'created_at' => optional($v->created_at)?->toISOString(),
                ];
            });
        $brands = Brand::orderBy('name')->get(['id','name']);
        $classes = VehicleClass::orderBy('name')->get(['id','name']);
        return Inertia::render('admin/vehicle-management/index', [
            'vehicles' => $vehicles,
            'brands' => $brands,
            'classes' => $classes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(VehicleRequest $request)
    {
        // Log the incoming request data
        Log::info('Vehicle creation request data:', $request->all());
        
        $validated = $request->validated();
        Log::info('Validated vehicle data:', $validated);
        
        // Set default values for the simplified form
        if (!isset($validated['vehicle_type'])) {
            $validated['vehicle_type'] = 'car';
        }
        
        if (!isset($validated['vehicle_class'])) {
            $validated['vehicle_class'] = 'luxury';
        }
        
        try {
            // Map brand and vehicle_class names to IDs (case-insensitive)
            $brandName = $validated['brand'] ?? null;
            $className = $validated['vehicle_class'] ?? null;

            $brand = $brandName ? Brand::whereRaw('LOWER(name) = LOWER(?)', [$brandName])->first() : null;
            if (!$brand) {
                return redirect()->back()->withErrors(['brand' => 'Unknown brand. Please add it first in Brand Management.']);
            }

            $vclass = $className ? VehicleClass::whereRaw('LOWER(name) = LOWER(?)', [$className])->first() : null;
            if (!$vclass) {
                return redirect()->back()->withErrors(['vehicle_class' => 'Unknown class. Please add it first in Vehicle Class Management.']);
            }

            $vehicleData = $validated;
            $vehicleData['brand_id'] = $brand->id;
            $vehicleData['vehicle_class_id'] = $vclass->id;
            unset($vehicleData['brand'], $vehicleData['vehicle_class']);

            // Create the vehicle
            $vehicle = Vehicle::create($vehicleData);
            Log::info('Created vehicle:', $vehicle->toArray());
            
            return redirect()->back()->with('success', 'Vehicle created successfully')->with('vehicle', $vehicle);
        } catch (\Exception $e) {
            Log::error('Failed to create vehicle: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create vehicle: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    // show() is unused by routes; removing specs-related loading for simplification

    /**
     * Update the specified resource in storage.
     */
    public function update(VehicleRequest $request, Vehicle $vehicle)
    {
        $validated = $request->validated();
        
        DB::beginTransaction();
        try {
            // Map brand and vehicle_class names to IDs (case-insensitive)
            $brandName = $validated['brand'] ?? null;
            $className = $validated['vehicle_class'] ?? null;

            $vehicleData = $validated;

            if ($brandName !== null) {
                $brand = Brand::whereRaw('LOWER(name) = LOWER(?)', [$brandName])->first();
                if (!$brand) {
                    return redirect()->back()->withErrors(['brand' => 'Unknown brand. Please add it first in Brand Management.']);
                }
                $vehicleData['brand_id'] = $brand->id;
            }

            if ($className !== null) {
                $vclass = VehicleClass::whereRaw('LOWER(name) = LOWER(?)', [$className])->first();
                if (!$vclass) {
                    return redirect()->back()->withErrors(['vehicle_class' => 'Unknown class. Please add it first in Vehicle Class Management.']);
                }
                $vehicleData['vehicle_class_id'] = $vclass->id;
            }

            unset($vehicleData['brand'], $vehicleData['vehicle_class']);

            // Update the vehicle
            $vehicle->update($vehicleData);
            
            DB::commit();
            return redirect()->back()->with('success', 'Vehicle updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update vehicle: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
 
        return redirect()
            ->back()
            ->with('success', 'Vehicle deleted successfully');
    }
}