<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('vehicle_class');
            $table->text('brand');
            $table->text('model');
            $table->integer('production_year')->nullable();
            $table->text('plate_no')->nullable()->unique();
            $table->integer('seat_count')->nullable();
            $table->text('engine_spec')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrentOnUpdate();
        });

        // Use PostgreSQL ENUM types created in 2025_10_28_020929_create_pg_enums.php
        DB::statement("ALTER TABLE vehicles ADD COLUMN vehicle_type vehicle_type NOT NULL");
        DB::statement("ALTER TABLE vehicles ADD COLUMN transmission transmission NULL");
        DB::statement("ALTER TABLE vehicles ADD COLUMN status active_status NOT NULL DEFAULT 'active'");

        Schema::table('vehicles', function (Blueprint $table) {
            $table->index(['vehicle_class','status'], 'idx_vehicles_class_status');
        });
    }

    public function down(): void { Schema::dropIfExists('vehicles'); }
};