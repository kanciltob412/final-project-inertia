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
            $table->enum('media_type', ['image', 'video'])->default('image')->after('image_link_url');
            $table->string('video_path')->nullable()->after('media_type');
            $table->string('youtube_url')->nullable()->after('video_path');
            $table->boolean('autoplay_video')->default(false)->after('youtube_url');
            $table->boolean('mute_video')->default(true)->after('autoplay_video');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carousels', function (Blueprint $table) {
            $table->dropColumn(['media_type', 'video_path', 'youtube_url', 'autoplay_video', 'mute_video']);
        });
    }
};
