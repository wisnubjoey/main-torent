<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VehicleRequest;
use App\Models\Vehicle;
use App\Models\VehicleSpecLuxury;
use App\Models\VehicleSpecSport;
use App\Models\VehicleSpecVacation;
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
        return Inertia::render('admin/vehicle-management/index', [
            'vehicles' => $vehicles
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
    public function show(Vehicle $vehicle)
    {
        // Load the appropriate specs based on vehicle class
        switch ($vehicle->vehicle_class) {
            case 'luxury':
                $vehicle->load('luxury');
                break;
            case 'sport':
                $vehicle->load('sport');
                break;
            case 'vacation':
                $vehicle->load('vacation');
                break;
        }
        
        return response()->json($vehicle);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(VehicleRequest $request, Vehicle $vehicle)
    {
        $validated = $request->validated();
        
        // Extract specs data based on vehicle class
        $specsData = [];
        if (isset($validated['specs']) && is_array($validated['specs'])) {
            $specsData = $validated['specs'];
            unset($validated['specs']);
        }
        
        DB::beginTransaction();
        try {
            // Update the vehicle
            $vehicle->update($validated);
            
            // Update the appropriate spec based on vehicle class
            if ($vehicle->vehicle_class === 'luxury' && isset($specsData['luxury'])) {
                if ($vehicle->luxury) {
                    $vehicle->luxury->update($specsData['luxury']);
                } else {
                    $vehicle->luxury()->create($specsData['luxury']);
                }
            } elseif ($vehicle->vehicle_class === 'sport' && isset($specsData['sport'])) {
                if ($vehicle->sport) {
                    $vehicle->sport->update($specsData['sport']);
                } else {
                    $vehicle->sport()->create($specsData['sport']);
                }
            } elseif ($vehicle->vehicle_class === 'vacation' && isset($specsData['vacation'])) {
                if ($vehicle->vacation) {
                    $vehicle->vacation->update($specsData['vacation']);
                } else {
                    $vehicle->vacation()->create($specsData['vacation']);
                }
            }
            
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
        // The related specs will be automatically deleted due to the onDelete('cascade') in the migration
        $vehicle->delete();
        return response()->json(['success' => true]);
    }
}