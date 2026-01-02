<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\ChecklistItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChecklistController extends Controller
{
    public function store(Request $request, string $noteId)
    {
        $note = Note::where('user_id', Auth::id())->findOrFail($noteId);

        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:255',
            'is_checked' => 'boolean',
            'position' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $item = $note->checklistItems()->create($request->all());

        return response()->json($item, 201);
    }

    public function update(Request $request, string $id)
    {
        $item = ChecklistItem::whereHas('note', function($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'text' => 'string|max:255',
            'is_checked' => 'boolean',
            'position' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $item->update($request->all());

        return response()->json($item);
    }

    public function destroy(string $id)
    {
        $item = ChecklistItem::whereHas('note', function($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);

        $item->delete();

        return response()->json(['message' => 'Checklist item deleted']);
    }

    public function toggle(string $id)
    {
        $item = ChecklistItem::whereHas('note', function($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);

        $item->update(['is_checked' => !$item->is_checked]);

        return response()->json($item);
    }
}
