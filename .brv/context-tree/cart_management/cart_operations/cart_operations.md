
## Relations
@cart_management/session_storage

The `RentalCartController` handles all cart operations: add, update, remove, and checkout.

---


'"'"'php
// app/Http/Controllers/User/RentalCartController.php

class RentalCartController extends Controller
{
    public function add(Request $request): RedirectResponse
    // ...
    public function update(Request $request): RedirectResponse
    // ...
    public function remove(Request $request): RedirectResponse
    // ...
    public function checkout(Request $request): RedirectResponse
    // ...
}
'"'"'
