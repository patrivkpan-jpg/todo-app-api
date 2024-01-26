<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('username', 255);
            $table->string('password', 255);
            $table->timestamps();
        });
        Schema::table('todo', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->after('duration')
                ->references('id')
                ->on('user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
