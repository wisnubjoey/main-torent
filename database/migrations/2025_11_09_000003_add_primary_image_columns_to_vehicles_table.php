<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('vehicles', function (Blueprint $table) {
            // Add nullable primary image path and optional alt text
            $table->string('primary_image_path')->nullable();
            $table->string('primary_image_alt')->nullable();
        });
    }

    public function down(): void {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['primary_image_path', 'primary_image_alt']);
        });
    }
};