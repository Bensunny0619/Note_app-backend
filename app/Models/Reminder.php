<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $fillable = ['note_id', 'user_id', 'remind_at', 'is_sent'];

    protected $casts = [
        'remind_at' => 'datetime',
        'is_sent' => 'boolean',
    ];

    public function note()
    {
        return $this->belongsTo(Note::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
