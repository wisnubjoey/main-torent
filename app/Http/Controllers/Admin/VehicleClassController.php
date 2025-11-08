<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VehicleClass;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VehicleClassController extends Controller
{
    public function index()
    {
        $classes = VehicleClass::orderBy('name')->get();
        return Inertia::render('admin/vehicle-class-management/index', [
            'classes' => $classes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:vehicle_classes,name'],
        ]);

        $class = VehicleClass::create($validated);
        Log::info('Created vehicle class', $class->toArray());
        return redirect()->back()->with('success', 'Vehicle class created');
    }

    public function destroy(VehicleClass $vehicleClass)
    {
        $vehicleClass->delete();
        return redirect()->back()->with('success', 'Vehicle class deleted');
    }

    public function update(Request $request, VehicleClass $vehicleClass)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('vehicle_classes', 'name')->ignore($vehicleClass->id),
            ],
        ]);

        $vehicleClass->update($validated);
        return redirect()->back()->with('success', 'Vehicle class updated');
    }
}