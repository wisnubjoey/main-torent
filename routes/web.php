<?php

use App\Http\Controllers\Admin\AdminAuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AdminAuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AdminAuthenticatedSessionController::class, 'store'])
            ->middleware('throttle:login')
            ->name('login.store');
    });

    Route::middleware(['admin'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('dashboard');
        Route::post('logout', [AdminAuthenticatedSessionController::class, 'destroy'])
            ->name('logout');
    });
});

require __DIR__.'/settings.php';
