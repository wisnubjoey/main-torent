<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->string('time_type')->nullable();
            $table->unsignedInteger('duration_units')->default(1);
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropColumn('time_type');
            $table->dropColumn('duration_units');
        });
    }
};

