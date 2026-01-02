
The `Vehicle` model has relationships with `Brand`, `VehicleClass`, and `VehicleImage`. It includes an accessor for the primary image URL and an event listener to automatically delete associated image files from storage when a vehicle is deleted.

---

'''php
// app/Models/Vehicle.php
class Vehicle extends Model 
{
    // ... fillable properties ...

    public function brand() { /* ... */ }
    public function vehicleClass() { /* ... */ }
    public function images() { /* ... */ }

    public function getImageUrlAttribute(): ?string { /* ... */ }

    protected static function booted(): void {
        static::deleting(function (Vehicle $vehicle) {
            $dir = "vehicles/{$vehicle->id}";
            if (Storage::disk('public')->exists($dir)) {
                Storage::disk('public')->deleteDirectory($dir);
            }
        });
    }
}
'''
