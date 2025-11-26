<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('vehicle_id');
            $table->integer('quantity');
            $table->bigInteger('unit_price_idr');
            $table->bigInteger('subtotal_idr');
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrentOnUpdate();

            $table->foreign('order_id')->references('id')->on('orders')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onUpdate('cascade')->onDelete('restrict');
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("CREATE INDEX idx_order_items_order_id ON order_items(order_id)");
            DB::statement("CREATE INDEX idx_order_items_vehicle_id ON order_items(vehicle_id)");
            DB::statement("ALTER TABLE order_items ADD CONSTRAINT order_items_qty_positive CHECK (quantity >= 1)");
            DB::statement("ALTER TABLE order_items ADD CONSTRAINT order_items_unit_nonneg CHECK (unit_price_idr >= 0)");
            DB::statement("ALTER TABLE order_items ADD CONSTRAINT order_items_subtotal_nonneg CHECK (subtotal_idr >= 0)");
        } else {
            Schema::table('order_items', function (Blueprint $table) {
                $table->index('order_id', 'idx_order_items_order_id');
                $table->index('vehicle_id', 'idx_order_items_vehicle_id');
            });
        }
    }

    public function down(): void {
        Schema::dropIfExists('order_items');
    }
};

