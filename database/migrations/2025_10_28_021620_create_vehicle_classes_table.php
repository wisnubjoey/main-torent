<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('vehicle_classes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->unique();
        });
    }

    public function down(): void { Schema::dropIfExists('vehicle_classes'); }
};