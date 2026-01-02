
## Relations
@structure/rental-order-model
@structure/rental-order-item-model

The `RentalOrderController` for admins handles the approval, starting, completion, and cancellation of rental orders. The `index` method displays draft and ongoing orders for approval.

---

'''php
// app/Http/Controllers/Admin/RentalOrderController.php

class RentalOrderController extends Controller
{
    public function index(): Response
    {
        $orders = RentalOrder::with([/* ... */])
        ->whereIn('status', ['draft', 'ongoing'])
        // ...
    }

    public function start(RentalOrder $order): RedirectResponse
    {
        // ... logic to start a rental ...
    }

    public function complete(RentalOrder $order): RedirectResponse
    {
        // ... logic to complete a rental ...
    }

    public function cancel(Request $request, RentalOrder $order): RedirectResponse
    {
        // ... logic to cancel a rental ...
    }
}
'''
