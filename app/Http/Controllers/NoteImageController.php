<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\NoteImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image; // Assuming intervention/image is used

class NoteImageController extends Controller
{
    public function store(Request $request, string $noteId)
    {
        $note = Note::where('user_id', Auth::id())->findOrFail($noteId);

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('note-images', 'public');
            $url = Storage::url($path);

            $noteImage = $note->images()->create([
                'image_path' => $path,
                'image_url' => asset($url),
                'position' => 0
            ]);

            return response()->json($noteImage, 201);
        }

        return response()->json(['message' => 'No image provided'], 400);
    }

    public function destroy(string $id)
    {
        $image = NoteImage::whereHas('note', function($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);

        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted']);
    }
}
