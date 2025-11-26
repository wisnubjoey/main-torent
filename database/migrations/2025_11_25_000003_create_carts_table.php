<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('carts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('status')->default('active');
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrentOnUpdate();

            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->index(['user_id','status'], 'idx_carts_user_status');
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE carts ADD CONSTRAINT carts_status_check CHECK (status IN ('active','converted'))");
        }
    }

    public function down(): void {
        Schema::dropIfExists('carts');
    }
};

