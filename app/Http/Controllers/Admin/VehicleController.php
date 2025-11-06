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
        $vehicles = Vehicle::all();
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
            // Create the vehicle
            $vehicle = Vehicle::create($validated);
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
            // Update the vehicle
            $vehicle->update($validated);
            
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