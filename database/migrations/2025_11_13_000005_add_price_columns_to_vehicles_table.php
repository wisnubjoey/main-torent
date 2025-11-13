<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        // Add simple IDR-based pricing columns to vehicles
        Schema::table('vehicles', function (Blueprint $table) {
            $table->bigInteger('price_daily_idr')->nullable();
            $table->bigInteger('price_weekly_idr')->nullable();
            $table->bigInteger('price_monthly_idr')->nullable();
        });

        // PostgreSQL: enforce non-negative amounts with CHECK constraints
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE vehicles ADD CONSTRAINT vehicles_price_daily_nonneg CHECK (price_daily_idr IS NULL OR price_daily_idr >= 0)");
            DB::statement("ALTER TABLE vehicles ADD CONSTRAINT vehicles_price_weekly_nonneg CHECK (price_weekly_idr IS NULL OR price_weekly_idr >= 0)");
            DB::statement("ALTER TABLE vehicles ADD CONSTRAINT vehicles_price_monthly_nonneg CHECK (price_monthly_idr IS NULL OR price_monthly_idr >= 0)");
        }
    }

    public function down(): void {
        // Drop CHECK constraints first on PostgreSQL
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_price_daily_nonneg");
            DB::statement("ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_price_weekly_nonneg");
            DB::statement("ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_price_monthly_nonneg");
        }

        // Remove pricing columns
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['price_daily_idr', 'price_weekly_idr', 'price_monthly_idr']);
        });
    }
};