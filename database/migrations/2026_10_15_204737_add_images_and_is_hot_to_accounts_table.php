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
        if (Schema::hasTable('accounts')) {
            Schema::table('accounts', function (Blueprint $table) {
                if (! Schema::hasColumn('accounts', 'images')) {
                    $table->json('images')->nullable()->after('image_url');
                }
                if (! Schema::hasColumn('accounts', 'is_hot')) {
                    $table->boolean('is_hot')->default(false)->after('status');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('accounts')) {
            Schema::table('accounts', function (Blueprint $table) {
                $columns = [];
                if (Schema::hasColumn('accounts', 'images')) {
                    $columns[] = 'images';
                }
                if (Schema::hasColumn('accounts', 'is_hot')) {
                    $columns[] = 'is_hot';
                }
                if (! empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }
    }
};
