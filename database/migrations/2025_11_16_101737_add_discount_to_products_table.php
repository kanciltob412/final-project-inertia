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
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('discount', 8, 2)->default(0)->after('price')->comment('Discount amount or percentage');
            $table->enum('discount_type', ['fixed', 'percentage'])->default('fixed')->after('discount')->comment('Type of discount: fixed amount or percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['discount', 'discount_type']);
        });
    }
};
