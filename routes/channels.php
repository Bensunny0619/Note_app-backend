<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('note.{noteId}', function ($user, $noteId) {
    $note = \App\Models\Note::find($noteId);
    
    if (!$note) {
        return false;
    }
    
    // Allow if user owns the note
    if ($note->user_id === $user->id) {
        return true;
    }
    
    // Allow if note is shared with the user
    return $note->sharedWith()->where('shared_with_user_id', $user->id)->exists();
});
