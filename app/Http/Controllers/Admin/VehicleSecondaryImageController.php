<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Filesystem\FilesystemAdapter;

class VehicleSecondaryImageController extends Controller {
    public function store(Request $request, Vehicle $vehicle) {
        $validated = $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,webp|max:51200',
        ]);

        $existing = VehicleImage::where('vehicle_id', $vehicle->id)->pluck('position')->all();
        $availablePositions = collect(range(0, 9))->diff($existing)->values()->all();

        if (count($availablePositions) === 0) {
            return response()->json(['message' => 'Maximum of 10 secondary images reached.'], 422);
        }

        $created = [];
        $images = $validated['images'];
        foreach ($images as $idx => $file) {
            if (!isset($availablePositions[$idx])) break;
            $ext = $file->getClientOriginalExtension();
            $filename = Str::uuid().'.'.$ext;
            $path = 'vehicles/'.$vehicle->id.'/secondary/'.$filename;
            Storage::disk('public')->putFileAs('vehicles/'.$vehicle->id.'/secondary', $file, $filename);

            $image = VehicleImage::create([
                'vehicle_id' => $vehicle->id,
                'path' => $path,
                'position' => $availablePositions[$idx],
                'alt_text' => null,
            ]);

            $created[] = [
                'id' => $image->id,
                'path' => $image->path,
                'url' => asset('storage/'.ltrim($image->path, '/')),
                'position' => $image->position,
                'alt_text' => $image->alt_text,
            ];
        }

        return response()->json(['created' => $created]);
    }

    public function destroy(Vehicle $vehicle, VehicleImage $image) {
        if ($image->vehicle_id !== $vehicle->id) {
            return response()->json(['message' => 'Image not found for this vehicle.'], 404);
        }

        if (Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        $image->delete();
        return response()->json(['deleted' => true]);
    }

    public function reorder(Request $request, Vehicle $vehicle) {
        $validated = $request->validate([
            'orders' => 'required|array|min:1',
            'orders.*.id' => 'required|integer|exists:vehicle_images,id',
            'orders.*.position' => 'required|integer|min:0|max:9',
        ]);

        $orders = collect($validated['orders']);
        $positions = $orders->pluck('position');
        if ($positions->unique()->count() !== $positions->count()) {
            return response()->json(['message' => 'Positions must be unique between 0 and 9.'], 422);
        }

        // Ensure all images belong to this vehicle
        $imageIds = $orders->pluck('id')->all();
        $countBelonging = VehicleImage::where('vehicle_id', $vehicle->id)->whereIn('id', $imageIds)->count();
        if ($countBelonging !== count($imageIds)) {
            return response()->json(['message' => 'One or more images do not belong to this vehicle.'], 422);
        }

        DB::transaction(function () use ($orders) {
            // Temporary bump to avoid unique constraint collisions
            foreach ($orders as $item) {
                VehicleImage::where('id', $item['id'])->update([
                    'position' => DB::raw('position + 10')
                ]);
            }
            foreach ($orders as $item) {
                VehicleImage::where('id', $item['id'])->update([
                    'position' => $item['position']
                ]);
            }
        });

        return response()->json(['reordered' => true]);
    }

    public function promote(Vehicle $vehicle, VehicleImage $image) {
        if ($image->vehicle_id !== $vehicle->id) {
            return response()->json(['message' => 'Image not found for this vehicle.'], 404);
        }

        // Delete old primary file if exists
        if ($vehicle->primary_image_path && Storage::disk('public')->exists($vehicle->primary_image_path)) {
            Storage::disk('public')->delete($vehicle->primary_image_path);
        }

        // Copy selected secondary path into primary_image_path and remove the secondary record
        $vehicle->primary_image_path = $image->path;
        $vehicle->primary_image_alt = $image->alt_text; // carry over alt if any
        $vehicle->save();

        $image->delete();

        return response()->json([
            'vehicle_id' => $vehicle->id,
            'primary_image_path' => $vehicle->primary_image_path,
            'primary_image_url' => asset('storage/'.ltrim($vehicle->primary_image_path, '/')),
            'primary_image_alt' => $vehicle->primary_image_alt,
        ]);
    }

    public function updateAlt(Request $request, Vehicle $vehicle, VehicleImage $image) {
        if ($image->vehicle_id !== $vehicle->id) {
            return response()->json(['message' => 'Image not found for this vehicle.'], 404);
        }

        $validated = $request->validate([
            'alt_text' => 'nullable|string',
        ]);

        $image->alt_text = $validated['alt_text'] ?? null;
        $image->save();

        return response()->json([
            'id' => $image->id,
            'alt_text' => $image->alt_text,
        ]);
    }
}