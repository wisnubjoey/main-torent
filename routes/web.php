<?php

use App\Http\Controllers\Admin\AdminAuthenticatedSessionController;
use App\Http\Controllers\Admin\RentalOrderController;
use App\Http\Controllers\Admin\RentalOrderHistoryController;
use App\Http\Controllers\User\RentalCartController;
use App\Http\Controllers\User\VehicleController;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('home');

Route::get('vehicles', function () {
    $vehicles = Vehicle::with(['brand:id,name', 'vehicleClass:id,name'])
        ->get()
        ->map(function ($v) {
            return [
                'id' => $v->id,
                'vehicle_type' => $v->vehicle_type,
                'vehicle_class' => optional($v->vehicleClass)->name ?? '',
                'brand' => optional($v->brand)->name ?? '',
                'model' => $v->model,
                'production_year' => $v->production_year,
                'seat_count' => $v->seat_count,
                'transmission' => $v->transmission,
                'image_url' => $v->image_url,
                'primary_image_alt' => $v->primary_image_alt,
            ];
        });

    return Inertia::render('public/vehicles/index', [
        'vehicles' => $vehicles,
    ]);
})->name('vehicles');

// Guest routes for authentication
Route::middleware('guest')->group(function () {
    Route::get('login', function () {
        return Inertia::render('user/auth/login');
    })->name('login');

    // Alias Fortify's POST /login to the name expected by tests
    Route::post('login', [\Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:login')
        ->name('login.store');
    
    Route::get('register', function () {
        return Inertia::render('user/auth/register');
    })->name('register');

    // Alias Fortify's POST /register to the name expected by tests
    Route::post('register', [\Laravel\Fortify\Http\Controllers\RegisteredUserController::class, 'store'])
        ->name('register.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('user/dashboard/index');
    })->name('dashboard');
    
    Route::get('dashboard/vehicles', function () {
        $vehicles = Vehicle::with(['brand:id,name', 'vehicleClass:id,name'])
            ->get()
            ->map(function ($v) {
                return [
                    'id' => $v->id,
                    'vehicle_type' => $v->vehicle_type,
                    'vehicle_class' => optional($v->vehicleClass)->name ?? '',
                    'brand' => optional($v->brand)->name ?? '',
                    'model' => $v->model,
                    'production_year' => $v->production_year,
                    'seat_count' => $v->seat_count,
                    'transmission' => $v->transmission,
                    'image_url' => $v->image_url,
                    'primary_image_alt' => $v->primary_image_alt,
                ];
            });

        return Inertia::render('user/vehicles/index', [
            'vehicles' => $vehicles,
        ]);
    })->name('dashboard.vehicles');
    
    Route::get('vehicles', [VehicleController::class, 'index'])->name('vehicles');
    
    // Rental cart routes
    Route::post('rental-cart/add', [RentalCartController::class, 'add'])->name('rental-cart.add');
    Route::post('rental-cart/update', [RentalCartController::class, 'update'])->name('rental-cart.update');
    Route::post('rental-cart/remove', [RentalCartController::class, 'remove'])->name('rental-cart.remove');
    Route::post('rental-cart/checkout', [RentalCartController::class, 'checkout'])->name('rental-cart.checkout');
    Route::get('my-orders', [RentalCartController::class, 'myOrders'])->name('my-orders');
    
    Route::get('vehicle', function () {
        return Inertia::render('user/vehicle');
    })->name('vehicle');
    
    Route::get('confirm-password', function () {
        return Inertia::render('user/auth/confirm-password');
    })->name('password.confirm');
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AdminAuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AdminAuthenticatedSessionController::class, 'store'])
            ->middleware('throttle:login')
            ->name('login.store');
    });

    Route::middleware(['admin'])->group(function () {
        Route::get('overview', function () {
            return Inertia::render('admin/overview/index');
        })->name('dashboard');
        
        Route::get('user-management', function () {
            return Inertia::render('admin/user-management/index');
        })->name('user-management');



        // Brand management
        Route::get('brand-management', [App\Http\Controllers\Admin\BrandController::class, 'index'])->name('brand-management');
        Route::post('brand-management', [App\Http\Controllers\Admin\BrandController::class, 'store'])->name('brand-management.store');
        Route::put('brand-management/{brand}', [App\Http\Controllers\Admin\BrandController::class, 'update'])->name('brand-management.update');
        Route::delete('brand-management/{brand}', [App\Http\Controllers\Admin\BrandController::class, 'destroy'])->name('brand-management.destroy');

        // Vehicle class management
        Route::get('vehicle-class-management', [App\Http\Controllers\Admin\VehicleClassController::class, 'index'])->name('vehicle-class-management');
        Route::post('vehicle-class-management', [App\Http\Controllers\Admin\VehicleClassController::class, 'store'])->name('vehicle-class-management.store');
        Route::put('vehicle-class-management/{vehicleClass}', [App\Http\Controllers\Admin\VehicleClassController::class, 'update'])->name('vehicle-class-management.update');
        Route::delete('vehicle-class-management/{vehicleClass}', [App\Http\Controllers\Admin\VehicleClassController::class, 'destroy'])->name('vehicle-class-management.destroy');

        Route::get('vehicle-management', [App\Http\Controllers\Admin\VehicleController::class, 'index'])->name('vehicle-management');
        Route::post('vehicle-management', [App\Http\Controllers\Admin\VehicleController::class, 'store'])->name('vehicle-management.store');
        Route::put('vehicle-management/{vehicle}', [App\Http\Controllers\Admin\VehicleController::class, 'update'])->name('vehicle-management.update');
        Route::delete('vehicle-management/{vehicle}', [App\Http\Controllers\Admin\VehicleController::class, 'destroy'])->name('vehicle-management.destroy');

        // Admin UI page for managing images of a vehicle
        Route::get('vehicles/{vehicle}/images', [App\Http\Controllers\Admin\VehicleImagePageController::class, 'show'])
            ->name('vehicle-images.page');

        // Vehicle image management
        Route::prefix('vehicles/{vehicle}')->group(function () {
            // Primary image
            Route::post('primary', [App\Http\Controllers\Admin\VehiclePrimaryImageController::class, 'store'])
                ->name('vehicle-images.primary.store');
            Route::delete('primary', [App\Http\Controllers\Admin\VehiclePrimaryImageController::class, 'destroy'])
                ->name('vehicle-images.primary.destroy');

            // Secondary images
            Route::post('secondary', [App\Http\Controllers\Admin\VehicleSecondaryImageController::class, 'store'])
                ->name('vehicle-images.secondary.store');
            Route::delete('secondary/{image}', [App\Http\Controllers\Admin\VehicleSecondaryImageController::class, 'destroy'])
                ->name('vehicle-images.secondary.destroy');
            Route::put('secondary/reorder', [App\Http\Controllers\Admin\VehicleSecondaryImageController::class, 'reorder'])
                ->name('vehicle-images.secondary.reorder');
            Route::post('secondary/{image}/promote', [App\Http\Controllers\Admin\VehicleSecondaryImageController::class, 'promote'])
                ->name('vehicle-images.secondary.promote');
            Route::put('secondary/{image}/alt', [App\Http\Controllers\Admin\VehicleSecondaryImageController::class, 'updateAlt'])
                ->name('vehicle-images.secondary.updateAlt');
        });

        // Rental order management
        Route::get('order/Approval', [RentalOrderController::class, 'index'])->name('orders.approval');
        Route::get('order/orderHistory', [RentalOrderHistoryController::class, 'index'])->name('orders.history');

        Route::post('logout', [AdminAuthenticatedSessionController::class, 'destroy'])
            ->name('logout');
    });
});

require __DIR__.'/settings.php';
