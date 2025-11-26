<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('cart_id');
            $table->unsignedBigInteger('vehicle_id');
            $table->integer('quantity')->default(1);
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrentOnUpdate();

            $table->foreign('cart_id')->references('id')->on('carts')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onUpdate('cascade')->onDelete('restrict');
            $table->unique(['cart_id','vehicle_id'], 'uq_cart_items_cart_vehicle');
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE cart_items ADD CONSTRAINT cart_items_qty_positive CHECK (quantity >= 1)");
        }
    }

    public function down(): void {
        Schema::dropIfExists('cart_items');
    }
};

