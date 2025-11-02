<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->enum('vehicle_type', ['car','motorcycle']);
            $table->enum('vehicle_class', ['luxury','sport','vacation']);
            $table->text('brand');
            $table->text('model');
            $table->integer('production_year')->nullable();
            $table->text('plate_no')->nullable()->unique();
            $table->text('vin')->nullable();
            $table->integer('seat_count')->nullable();
            $table->enum('transmission', ['manual','automatic','semi-automatic'])->nullable();
            $table->text('engine_spec')->nullable();
            $table->decimal('base_daily_rate', 12, 2)->default(0);
            $table->enum('status', ['active','maintenance','retired'])->default('active');
            $table->timestampTz('created_at')->useCurrent();
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->index(['vehicle_class','status'], 'idx_vehicles_class_status');
        });
    }

    public function down(): void { Schema::dropIfExists('vehicles'); }
};