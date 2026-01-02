<?php

namespace App\Http\Controllers;

use App\Models\Label;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LabelController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->labels);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $label = Auth::user()->labels()->create($request->all());

        return response()->json($label, 201);
    }

    public function update(Request $request, string $id)
    {
        $label = Auth::user()->labels()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:50',
            'color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $label->update($request->all());

        return response()->json($label);
    }

    public function destroy(string $id)
    {
        $label = Auth::user()->labels()->findOrFail($id);
        $label->delete();

        return response()->json(['message' => 'Label deleted']);
    }

    public function attachToNote(Request $request, string $noteId)
    {
        $note = Note::where('user_id', Auth::id())->findOrFail($noteId);
        
        $validator = Validator::make($request->all(), [
            'label_id' => 'required|exists:labels,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Verify label belongs to user
        $label = Label::where('user_id', Auth::id())->findOrFail($request->label_id);

        $note->labels()->syncWithoutDetaching([$label->id]);

        return response()->json(['message' => 'Label attached', 'note' => $note->load('labels')]);
    }

    public function detachFromNote(string $noteId, string $labelId)
    {
        $note = Note::where('user_id', Auth::id())->findOrFail($noteId);
        $note->labels()->detach($labelId);

        return response()->json(['message' => 'Label detached', 'note' => $note->load('labels')]);
    }
}
