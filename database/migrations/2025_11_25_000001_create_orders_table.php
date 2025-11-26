<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('time_type');
            $table->integer('duration_units');
            $table->timestampTz('start_at');
            $table->timestampTz('end_at');
            $table->bigInteger('total_amount_idr')->default(0);
            $table->timestampTz('approved_at')->nullable();
            $table->timestampTz('completed_at')->nullable();
            $table->timestampTz('cancelled_at')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrentOnUpdate();

            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE orders ADD COLUMN status rental_status NOT NULL DEFAULT 'reserved'");
            DB::statement("CREATE INDEX idx_orders_user_id ON orders(user_id)");
            DB::statement("CREATE INDEX idx_orders_status ON orders(status)");
            DB::statement("CREATE INDEX idx_orders_start_at ON orders(start_at)");
            DB::statement("CREATE INDEX idx_orders_end_at ON orders(end_at)");
            DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_time_type_check CHECK (time_type IN ('daily','weekly','monthly'))");
            DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_total_nonneg CHECK (total_amount_idr >= 0)");
            DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_duration_positive CHECK (duration_units >= 1)");
        } else {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('status')->default('reserved');
                $table->index('user_id', 'idx_orders_user_id');
                $table->index('status', 'idx_orders_status');
                $table->index('start_at', 'idx_orders_start_at');
                $table->index('end_at', 'idx_orders_end_at');
            });
        }
    }

    public function down(): void {
        Schema::dropIfExists('orders');
    }
};

