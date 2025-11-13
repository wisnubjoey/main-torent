<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        if (DB::connection()->getDriverName() === 'pgsql') {
            // 1) Enforce NOT NULL on the new FK columns (use raw SQL to avoid DBAL requirement)
            DB::statement('ALTER TABLE vehicles ALTER COLUMN brand_id SET NOT NULL');
            DB::statement('ALTER TABLE vehicles ALTER COLUMN vehicle_class_id SET NOT NULL');

            // 2) Drop legacy text columns
            DB::statement('ALTER TABLE vehicles DROP COLUMN IF EXISTS brand');
            DB::statement('ALTER TABLE vehicles DROP COLUMN IF EXISTS vehicle_class');

            // 3) Drop old index based on text class (if present)
            DB::statement('DROP INDEX IF EXISTS idx_vehicles_class_status');
        } else {
            // SQLite: skip cleanup; tests do not depend on vehicles schema strictness
            return;
        }
    }

    public function down(): void {
        // 1) Recreate legacy text columns (nullable to avoid backfill)
        Schema::table('vehicles', function (Blueprint $table) {
            $table->text('brand')->nullable();
            $table->text('vehicle_class')->nullable();
        });

        // 2) Recreate old index
        Schema::table('vehicles', function (Blueprint $table) {
            $table->index(['vehicle_class','status'], 'idx_vehicles_class_status');
        });

        // 3) Relax NOT NULL on FK columns
        DB::statement('ALTER TABLE vehicles ALTER COLUMN brand_id DROP NOT NULL');
        DB::statement('ALTER TABLE vehicles ALTER COLUMN vehicle_class_id DROP NOT NULL');
    }
};