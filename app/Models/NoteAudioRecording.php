<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoteAudioRecording extends Model
{
    protected $fillable = [
        'note_id',
        'audio_path',
        'audio_url',
        'duration',
        'format',
        'file_size',
        'position'
    ];

    public function note()
    {
        return $this->belongsTo(Note::class);
    }
}
