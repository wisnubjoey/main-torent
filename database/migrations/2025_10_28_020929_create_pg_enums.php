<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        // PostgreSQL doesn't support IF NOT EXISTS directly in CREATE TYPE
        // Using DO block with conditional logic instead
        DB::statement("DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN CREATE TYPE vehicle_type AS ENUM ('car','motorcycle'); END IF; END $$;");
    }

    public function down(): void {
        // Drop the vehicle_type enum
        DB::statement("DROP TYPE IF EXISTS vehicle_type CASCADE");
    }
};
