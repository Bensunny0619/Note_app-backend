<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'user_id', 'title', 'content', 'color', 'is_pinned', 
        'is_archived', 'position', 'last_synced_at'
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_archived' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function checklistItems()
    {
        return $this->hasMany(ChecklistItem::class)->orderBy('position');
    }

    public function labels()
    {
        return $this->belongsToMany(Label::class, 'note_label');
    }

    public function images()
    {
        return $this->hasMany(NoteImage::class)->orderBy('position');
    }

    public function reminder()
    {
        return $this->hasOne(Reminder::class);
    }

    public function sharedWith()
    {
        return $this->belongsToMany(User::class, 'shared_notes', 'note_id', 'shared_with_user_id')
                    ->withPivot('permission')
                    ->withTimestamps();
    }

    public function audioRecordings()
    {
        return $this->hasMany(NoteAudioRecording::class)->orderBy('position');
    }

    public function drawings()
    {
        return $this->hasMany(NoteDrawing::class)->orderBy('position');
    }
}
