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
        Schema::table('order', function (Blueprint $table) {
            $table->string('shipping_courier')->nullable()->after('postal_code');
            $table->string('shipping_service')->nullable()->after('shipping_courier');
            $table->integer('shipping_cost')->default(0)->after('shipping_service');
            $table->integer('destination_city_id')->nullable()->after('shipping_cost');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order', function (Blueprint $table) {
            $table->dropColumn(['shipping_courier', 'shipping_service', 'shipping_cost', 'destination_city_id']);
        });
    }
};
