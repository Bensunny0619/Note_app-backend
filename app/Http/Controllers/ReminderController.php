<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Reminder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReminderController extends Controller
{
    public function store(Request $request, string $noteId)
    {
        $note = Note::where('user_id', Auth::id())->findOrFail($noteId);

        $validator = Validator::make($request->all(), [
            'remind_at' => 'required|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $reminder = $note->reminder()->updateOrCreate(
            ['note_id' => $note->id],
            ['user_id' => Auth::id(), 'remind_at' => $request->remind_at, 'is_sent' => false]
        );

        return response()->json($reminder, 201);
    }

    public function destroy(string $id)
    {
        $reminder = Reminder::where('user_id', Auth::id())->findOrFail($id);
        $reminder->delete();

        return response()->json(['message' => 'Reminder deleted']);
    }
}
