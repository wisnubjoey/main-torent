<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VehicleImagePageController extends Controller {
    public function show(Vehicle $vehicle) {
        $secondary = $vehicle->secondaryImagesOrdered()->get()->map(function ($img) {
            return [
                'id' => $img->id,
                'path' => $img->path,
                'url' => asset('storage/'.ltrim($img->path, '/')),
                'position' => $img->position,
                'alt_text' => $img->alt_text,
            ];
        });

        $payload = [
            'vehicle' => [
                'id' => $vehicle->id,
                'model' => $vehicle->model,
                'brand' => $vehicle->brand,
                'plate_no' => $vehicle->plate_no,
                'image_url' => $vehicle->image_url,
                'primary_image_alt' => $vehicle->primary_image_alt,
            ],
            'secondaryImages' => $secondary,
            'maxSecondary' => 10,
        ];

        if (request()->wantsJson()) {
            return response()->json($payload);
        }

        return Inertia::render('admin/vehicle-management/images', $payload);
    }
}