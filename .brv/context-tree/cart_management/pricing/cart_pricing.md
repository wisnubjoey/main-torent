
Pricing is determined by the selected mode (daily, weekly, monthly) and the quantity. The `getVehiclePrice` method in the `RentalCartController` retrieves the correct price based on the mode.

---


'"'"'php
// app/Http/Controllers/User/RentalCartController.php

private function getVehiclePrice($vehicle, $mode): int
{
    switch ($mode) {
        case 'daily':
            return $vehicle->price_daily_idr;
        case 'weekly':
            return $vehicle->price_weekly_idr;
        case 'monthly':
            return $vehicle->price_monthly_idr;
        default:
            throw new \InvalidArgumentException("Invalid rental mode: {$mode}");
    }
}
'"'"'
