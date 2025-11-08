<?php

use App\Http\Controllers\Admin\AdminAuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('home');

// Guest routes for authentication
Route::middleware('guest')->group(function () {
    Route::get('login', function () {
        return Inertia::render('user/auth/login');
    })->name('login');
    
    Route::get('register', function () {
        return Inertia::render('user/auth/register');
    })->name('register');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('dashboard');
    
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

        Route::post('logout', [AdminAuthenticatedSessionController::class, 'destroy'])
            ->name('logout');
    });
});

require __DIR__.'/settings.php';
