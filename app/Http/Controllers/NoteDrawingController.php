<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Note;
use App\Models\NoteDrawing;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Events\NoteUpdated;

class NoteDrawingController extends Controller
{
    public function store(Request $request, string $noteId)
    {
        $request->validate([
            'drawing' => 'required|file|mimes:png,jpg,svg,jpeg|max:5120', // 5MB max
            'stroke_data' => 'nullable|string', // JSON string
            'canvas_width' => 'nullable|integer',
            'canvas_height' => 'nullable|integer',
        ]);

        $note = Note::where('user_id', Auth::id())->findOrFail($noteId);

        if ($request->hasFile('drawing')) {
            $file = $request->file('drawing');
            $path = $file->store('note-drawings', 'public');
            
            $drawing = $note->drawings()->create([
                'drawing_path' => $path,
                'drawing_url' => asset('storage/' . $path),
                'stroke_data' => $request->stroke_data,
                'canvas_width' => $request->canvas_width ?? 800,
                'canvas_height' => $request->canvas_height ?? 600,
                'format' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
            ]);

            broadcast(new NoteUpdated($note->fresh()))->toOthers();

            return response()->json($drawing, 201);
        }

        return response()->json(['message' => 'No drawing file uploaded'], 400);
    }

    public function destroy(string $id)
    {
        $drawing = NoteDrawing::whereHas('note', function($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);

        Storage::disk('public')->delete($drawing->drawing_path);
        
        $note = $drawing->note;
        $drawing->delete();

        broadcast(new NoteUpdated($note->fresh()))->toOthers();

        return response()->json(['message' => 'Drawing deleted']);
    }
}
