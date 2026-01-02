<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\User;
use App\Models\SharedNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ShareController extends Controller
{
    public function share(Request $request, string $noteId)
    {
        $note = Note::where('user_id', Auth::id())->findOrFail($noteId);

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'permission' => 'required|in:view,edit'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userToShareWith = User::where('email', $request->email)->first();

        if ($userToShareWith->id === Auth::id()) {
            return response()->json(['message' => 'Cannot share with yourself'], 422);
        }

        $sharedNote = SharedNote::updateOrCreate(
            ['note_id' => $note->id, 'shared_with_user_id' => $userToShareWith->id],
            ['owner_id' => Auth::id(), 'permission' => $request->permission]
        );

        return response()->json(['message' => 'Note shared', 'shared' => $sharedNote]);
    }

    public function unshare(string $id)
    {
        $sharedNote = SharedNote::where('owner_id', Auth::id())->findOrFail($id);
        $sharedNote->delete();

        return response()->json(['message' => 'Sharing revoked']);
    }

    public function sharedWithMe()
    {
        $user = Auth::user();
        $notes = $user->sharedNotes()->with(['checklistItems', 'labels', 'images', 'reminder'])->get();

        return response()->json($notes);
    }
}
