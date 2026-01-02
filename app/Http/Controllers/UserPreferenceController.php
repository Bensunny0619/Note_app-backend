<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserPreferenceController extends Controller
{
    public function show()
    {
        $preference = Auth::user()->preference;
        
        // If preference doesn't exist, create it
        if (!$preference) {
            $preference = Auth::user()->preference()->create();
        }

        return response()->json($preference);
    }

    public function update(Request $request)
    {
        $preference = Auth::user()->preference;

        if (!$preference) {
            $preference = Auth::user()->preference()->create();
        }

        $validator = Validator::make($request->all(), [
            'dark_mode' => 'boolean',
            'default_note_color' => 'string|max:7'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $preference->update($request->all());

        return response()->json($preference);
    }
}
