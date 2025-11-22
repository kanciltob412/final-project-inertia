<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations - Drop product_variants table and related color field.
     */
    public function up(): void
    {
        // Disable foreign key checks
        Schema::disableForeignKeyConstraints();

        // Drop the product_variants table if it exists
        if (Schema::hasTable('product_variants')) {
            Schema::dropIfExists('product_variants');
        }

        // Remove color field from products table if it exists
        if (Schema::hasColumn('products', 'color')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('color');
            });
        }

        // Remove dimension field from products table if it exists
        if (Schema::hasColumn('products', 'dimension')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('dimension');
            });
        }

        // Re-enable foreign key checks
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This is a cleanup migration, we won't restore the tables on rollback
        // as they are no longer part of the app structure
    }
};
