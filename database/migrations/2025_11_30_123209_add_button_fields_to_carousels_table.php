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
        Schema::table('carousels', function (Blueprint $table) {
            $table->string('button_1_text')->nullable()->after('image_path');
            $table->string('button_1_url')->nullable()->after('button_1_text');
            $table->string('button_2_text')->nullable()->after('button_1_url');
            $table->string('button_2_url')->nullable()->after('button_2_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carousels', function (Blueprint $table) {
            $table->dropColumn(['button_1_text', 'button_1_url', 'button_2_text', 'button_2_url']);
        });
    }
};
