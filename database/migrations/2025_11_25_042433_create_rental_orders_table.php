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
        Schema::create('rental_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('draft');
            $table->bigInteger('total_price_idr');
            $table->text('notes')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrentOnUpdate();
        });

        // Add CHECK constraint for status field only on PostgreSQL
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE rental_orders ADD CONSTRAINT rental_orders_status_check CHECK (status IN ('draft', 'ongoing', 'completed', 'cancelled'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop CHECK constraint first only on PostgreSQL
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE rental_orders DROP CONSTRAINT IF EXISTS rental_orders_status_check");
        }
        
        Schema::dropIfExists('rental_orders');
    }
};
