<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        DB::statement("CREATE TYPE vehicle_type     AS ENUM ('car','motorcycle')");
        DB::statement("CREATE TYPE transmission     AS ENUM ('manual','automatic','semi-automatic')");
        DB::statement("CREATE TYPE rental_status    AS ENUM ('draft','reserved','ongoing','returned','cancelled','closed')");
        DB::statement("CREATE TYPE active_status    AS ENUM ('active','maintenance','retired')");
    }

    public function down(): void {
        DB::statement("DROP TYPE IF EXISTS active_status");
        DB::statement("DROP TYPE IF EXISTS rental_status");
        DB::statement("DROP TYPE IF EXISTS transmission");
        DB::statement("DROP TYPE IF EXISTS vehicle_type");
    }
};
