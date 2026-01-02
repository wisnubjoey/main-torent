
## Relations
@cart_management/frontend

The `RentalCartController` manages the backend logic for the rental cart, using the Laravel session for storage. It exposes endpoints for adding, updating, removing items, and checking out.

---

'''php
// app/Http/Controllers/User/RentalCartController.php

class RentalCartController extends Controller
{
    public function add(Request $request): RedirectResponse { /* ... */ }
    public function update(Request $request): RedirectResponse { /* ... */ }
    public function remove(Request $request): RedirectResponse { /* ... */ }
    public function checkout(Request $request): RedirectResponse { /* ... */ }
}
'''
