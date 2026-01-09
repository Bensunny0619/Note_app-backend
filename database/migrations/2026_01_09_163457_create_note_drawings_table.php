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
        Schema::create('note_drawings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('note_id')->constrained()->onDelete('cascade');
            $table->string('drawing_path'); // storage path for image
            $table->string('drawing_url'); // public URL
            $table->string('thumbnail_url')->nullable(); // thumbnail for preview
            $table->integer('canvas_width')->default(800);
            $table->integer('canvas_height')->default(600);
            $table->text('stroke_data')->nullable(); // JSON stroke data for editing
            $table->string('format', 10)->default('png'); // png, svg, jpg
            $table->unsignedBigInteger('file_size')->nullable(); // in bytes
            $table->integer('position')->default(0); // ordering
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_drawings');
    }
};
