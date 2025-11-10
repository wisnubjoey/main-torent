<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('vehicle_images', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->string('path');
            $table->unsignedTinyInteger('position');
            $table->string('alt_text')->nullable();

            // Use timezone-aware timestamps, consistent with existing schema style
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrentOnUpdate();

            // Ensure per-vehicle unique ordering position
            $table->unique(['vehicle_id', 'position'], 'vehicle_images_vehicle_position_unique');
        });

        // Enforce position range 0-9 on PostgreSQL
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE vehicle_images ADD CONSTRAINT vehicle_images_position_range CHECK (position >= 0 AND position <= 9)");
        }
    }

    public function down(): void {
        Schema::dropIfExists('vehicle_images');
    }
};