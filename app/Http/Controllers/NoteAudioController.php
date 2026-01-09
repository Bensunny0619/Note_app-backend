<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Note;
use App\Models\NoteAudioRecording;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Events\NoteUpdated;

class NoteAudioController extends Controller
{
    public function store(Request $request, string $noteId)
    {
        $request->validate([
            'audio' => 'required|file|mimes:mp3,wav,ogg,m4a|max:10240', // 10MB max
            'duration' => 'nullable|integer',
        ]);

        $note = Note::where('user_id', Auth::id())->findOrFail($noteId);

        if ($request->hasFile('audio')) {
            $file = $request->file('audio');
            $path = $file->store('note-audio', 'public');
            
            $audio = $note->audioRecordings()->create([
                'audio_path' => $path,
                'audio_url' => asset('storage/' . $path),
                'duration' => $request->duration,
                'format' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
            ]);

            broadcast(new NoteUpdated($note->fresh()))->toOthers();

            return response()->json($audio, 201);
        }

        return response()->json(['message' => 'No audio file uploaded'], 400);
    }

    public function destroy(string $id)
    {
        $audio = NoteAudioRecording::whereHas('note', function($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);

        Storage::disk('public')->delete($audio->audio_path);
        
        $note = $audio->note;
        $audio->delete();

        broadcast(new NoteUpdated($note->fresh()))->toOthers();

        return response()->json(['message' => 'Audio recording deleted']);
    }
}
