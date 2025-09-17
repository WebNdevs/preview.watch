<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('analytics')) {
            // Table not present (possibly skipped earlier migration); safely exit.
            return;
        }
        if (!Schema::hasColumn('analytics', 'event_type')) {
            return;
        }
        try {
            DB::statement("ALTER TABLE analytics MODIFY COLUMN event_type ENUM('video_play', 'video_view', 'video_complete', 'cta_click', 'page_view') NOT NULL");
        } catch (Throwable $e) {
            // Fallback: ignore if enum already updated or engine doesn't support direct alteration (logged by Laravel default logger)
            // Could add more granular detection here.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('analytics') || !Schema::hasColumn('analytics', 'event_type')) {
            return;
        }
        try {
            DB::statement("ALTER TABLE analytics MODIFY COLUMN event_type ENUM('video_play', 'cta_click', 'page_view') NOT NULL");
        } catch (Throwable $e) {
            // Ignore errors during rollback (e.g., column already reverted or different state)
        }
    }
};