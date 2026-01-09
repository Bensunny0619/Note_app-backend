<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoteDrawing extends Model
{
    protected $fillable = [
        'note_id',
        'drawing_path',
        'drawing_url',
        'thumbnail_url',
        'canvas_width',
        'canvas_height',
        'stroke_data',
        'format',
        'file_size',
        'position'
    ];

    public function note()
    {
        return $this->belongsTo(Note::class);
    }
}
