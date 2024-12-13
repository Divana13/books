<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserBookProgress;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreUserBookProgressRequest;

class UserBookProgressController extends Controller
{
    public function saveProgress(StoreUserBookProgressRequest $request)
    {
        UserBookProgress::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'book_id' => $request->book_id
                ],
                [
                    'last_page' => $request->last_page
                ]
            );

        return response()->json([
            'message' => 'Progress saved!'
        ]);
    }
    Public function getProgress($bookId)
    {
        $progress = UserBookProgress::where('user_id', Auth::id())
            ->where('book_id', $bookId)
            ->first();

        return response()->json($progress);
    }
}
