<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = ['user_id', 'dark_mode', 'default_note_color'];

    protected $casts = [
        'dark_mode' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
