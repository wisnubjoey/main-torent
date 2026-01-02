
## Relations
@@structure/vehicle_model

The `VehicleController` in the admin namespace manages CRUD operations for vehicles. It handles mapping brand and vehicle class names to their respective IDs when creating or updating vehicles.

---

'''php
// app/Http/Controllers/Admin/VehicleController.php
class VehicleController extends Controller
{
    public function store(VehicleRequest $request)
    {
        // ... map brand/class names to IDs ...
        $vehicle = Vehicle::create($vehicleData);
        // ...
    }

    public function update(VehicleRequest $request, Vehicle $vehicle)
    {
        // ... map brand/class names to IDs ...
        $vehicle->update($vehicleData);
        // ...
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        // ...
    }
}
'''
