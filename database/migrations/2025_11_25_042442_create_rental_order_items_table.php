<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rental_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_order_id')->constrained('rental_orders')->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->string('mode');
            $table->integer('quantity');
            $table->timestampTz('start_at');
            $table->timestampTz('end_at');
            $table->bigInteger('price_per_unit_idr');
            $table->bigInteger('subtotal_price_idr');
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrentOnUpdate();
            
            // Indexes for performance
            $table->index(['vehicle_id', 'start_at', 'end_at'], 'idx_vehicle_rental_period');
            $table->index(['rental_order_id', 'vehicle_id'], 'idx_order_vehicle');
        });

        // Add CHECK constraints only on PostgreSQL
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE rental_order_items ADD CONSTRAINT rental_order_items_mode_check CHECK (mode IN ('daily', 'weekly', 'monthly'))");
            DB::statement("ALTER TABLE rental_order_items ADD CONSTRAINT rental_order_items_dates_check CHECK (end_at > start_at)");
            DB::statement("ALTER TABLE rental_order_items ADD CONSTRAINT rental_order_items_quantity_check CHECK (quantity > 0)");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop CHECK constraints first only on PostgreSQL
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE rental_order_items DROP CONSTRAINT IF EXISTS rental_order_items_mode_check");
            DB::statement("ALTER TABLE rental_order_items DROP CONSTRAINT IF EXISTS rental_order_items_dates_check");
            DB::statement("ALTER TABLE rental_order_items DROP CONSTRAINT IF EXISTS rental_order_items_quantity_check");
        }
        
        Schema::dropIfExists('rental_order_items');
    }
};
