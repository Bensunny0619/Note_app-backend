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
        Schema::create('note_audio_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('note_id')->constrained()->onDelete('cascade');
            $table->string('audio_path'); // storage path
            $table->string('audio_url'); // public URL
            $table->integer('duration')->nullable(); // duration in seconds
            $table->string('format', 10)->default('mp3'); // mp3, m4a, wav, ogg
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
        Schema::dropIfExists('note_audio_recordings');
    }
};
