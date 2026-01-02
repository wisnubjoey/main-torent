
## Relations
@@structure/inertia_setup

The application uses the Laravel Wayfinder package to generate type-safe route definitions for the frontend. This provides helpers like `route.url()`, `route.get()`, and `route.post()` with TypeScript type safety, improving developer experience and reducing runtime errors.

---

'''php
// routes/web.php

// ... route definitions ...

Route::post('rental-cart/add', [RentalCartController::class, 'add'])->name('rental-cart.add');

// ... which generates ...

// resources/js/routes/rental-cart.ts

/**
 * @url '/rental-cart/add'
 * @name 'rental-cart.add'
 * @methods POST
 * @controller App\Http\Controllers\User\RentalCartController@add
 * @file routes/web.php:93
 */
export const add = route.post<{
    vehicle_id: number;
}>('rental-cart.add');
'''
