<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChecklistItem extends Model
{
    protected $fillable = ['note_id', 'text', 'is_checked', 'position'];

    protected $casts = [
        'is_checked' => 'boolean',
    ];

    public function note()
    {
        return $this->belongsTo(Note::class);
    }
}
