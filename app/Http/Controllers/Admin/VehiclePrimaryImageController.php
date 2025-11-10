<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VehiclePrimaryImageController extends Controller {
    public function store(Request $request, Vehicle $vehicle) {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,webp|max:51200',
            'alt' => 'nullable|string',
        ]);

        $file = $validated['image'];
        $ext = $file->getClientOriginalExtension();
        $filename = Str::random(40).'.'.$ext;
        $path = 'vehicles/'.$vehicle->id.'/primary/'.$filename;

        // Delete old primary file if exists
        if ($vehicle->primary_image_path && Storage::disk('public')->exists($vehicle->primary_image_path)) {
            Storage::disk('public')->delete($vehicle->primary_image_path);
        }

        Storage::disk('public')->putFileAs('vehicles/'.$vehicle->id.'/primary', $file, $filename);

        $vehicle->primary_image_path = $path;
        if (array_key_exists('alt', $validated)) {
            $vehicle->primary_image_alt = $validated['alt'];
        }
        $vehicle->save();

        return response()->json([
            'vehicle_id' => $vehicle->id,
            'primary_image_path' => $vehicle->primary_image_path,
            'primary_image_url' => asset('storage/'.ltrim($vehicle->primary_image_path, '/')),
            'primary_image_alt' => $vehicle->primary_image_alt,
        ]);
    }

    public function destroy(Vehicle $vehicle) {
        if ($vehicle->primary_image_path && Storage::disk('public')->exists($vehicle->primary_image_path)) {
            Storage::disk('public')->delete($vehicle->primary_image_path);
        }

        $vehicle->primary_image_path = null;
        $vehicle->primary_image_alt = null;
        $vehicle->save();

        return response()->json([
            'vehicle_id' => $vehicle->id,
            'primary_image_path' => null,
            'primary_image_url' => null,
            'primary_image_alt' => null,
        ]);
    }
}