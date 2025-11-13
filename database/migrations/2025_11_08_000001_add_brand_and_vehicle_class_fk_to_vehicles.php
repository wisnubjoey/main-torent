<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        // 1) Add new nullable FK columns (keep existing text columns for now)
        Schema::table('vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('brand_id')->nullable();
            $table->unsignedBigInteger('vehicle_class_id')->nullable();
        });

        // 2) Backfill IDs from existing text columns, using case-insensitive matching
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("UPDATE vehicles v SET brand_id = b.id FROM brands b WHERE lower(b.name) = lower(v.brand)");
            DB::statement("UPDATE vehicles v SET vehicle_class_id = vc.id FROM vehicle_classes vc WHERE lower(vc.name) = lower(v.vehicle_class)");
        } else {
            // SQLite-compatible correlated subquery updates
            DB::statement("UPDATE vehicles SET brand_id = (SELECT id FROM brands WHERE lower(name) = lower(vehicles.brand))");
            DB::statement("UPDATE vehicles SET vehicle_class_id = (SELECT id FROM vehicle_classes WHERE lower(name) = lower(vehicles.vehicle_class))");
        }

        // 3) Add helpful indexes
        Schema::table('vehicles', function (Blueprint $table) {
            $table->index('brand_id', 'idx_vehicles_brand_id');
            $table->index(['vehicle_class_id', 'status'], 'idx_vehicles_vclass_id_status');
        });

        // 4) Add foreign keys (PG-only path) and validate after backfill
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE vehicles ADD CONSTRAINT fk_vehicles_brand_id FOREIGN KEY (brand_id) REFERENCES brands(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID");
            DB::statement("ALTER TABLE vehicles ADD CONSTRAINT fk_vehicles_vehicle_class_id FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID");
            DB::statement("ALTER TABLE vehicles VALIDATE CONSTRAINT fk_vehicles_brand_id");
            DB::statement("ALTER TABLE vehicles VALIDATE CONSTRAINT fk_vehicles_vehicle_class_id");
        }
    }

    public function down(): void {
        // Drop FKs (PG-only)
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS fk_vehicles_brand_id");
            DB::statement("ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS fk_vehicles_vehicle_class_id");
        }

        // Drop indexes
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropIndex('idx_vehicles_brand_id');
            $table->dropIndex('idx_vehicles_vclass_id_status');
        });

        // Drop columns
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['brand_id', 'vehicle_class_id']);
        });
    }
};