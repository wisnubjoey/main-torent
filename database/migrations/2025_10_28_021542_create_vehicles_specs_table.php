<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('vehicle_spec_vacation', function (Blueprint $table) {
            $table->unsignedBigInteger('vehicle_id')->primary();
            $table->integer('seater');
            $table->enum('usage', ['family','compact','offroad']);
            $table->enum('body', ['sedan','van','suv','hatchback']);
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
        });

        Schema::create('vehicle_spec_sport', function (Blueprint $table) {
            $table->unsignedBigInteger('vehicle_id')->primary();
            $table->decimal('zero_to_100_sec', 5, 2);
            $table->text('engine_spec');
            $table->enum('transmission', ['manual','automatic','semi-automatic']);
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
        });

        Schema::create('vehicle_spec_luxury', function (Blueprint $table) {
            $table->unsignedBigInteger('vehicle_id')->primary();
            $table->enum('body', ['sedan','van']);
            $table->boolean('driver_included')->default(true);
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('vehicle_spec_luxury');
        Schema::dropIfExists('vehicle_spec_sport');
        Schema::dropIfExists('vehicle_spec_vacation');
    }
};
