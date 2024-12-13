<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use App\Http\Resources\BookResource;
use App\Http\Requests\StoreBookRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateBookRequest;
use Illuminate\Support\Facades\Cache;

class BookController extends Controller
{
    public function upload(StoreBookRequest $request)
    {

        // Get original file name
        $originalName = $request->file('pdf')->getClientOriginalName();

        // Generate a unique file name to avoid overwriting
        $storedFileName = time() . '-' . $originalName;

        // Save the file in storage/public/books directory. Need to run comment php artisan storage:link
        $path = $request->file('pdf')->storeAs('books', $storedFileName, 'public');

        $book = Book::create([
            'title' => $request->input('title'),
            'author' => $request->input('author'),
            'file_name' => $originalName,
            'path' => $path
        ]);


        return new BookResource($book);
    }

    public function index()
    {
        $books = Book::latest()->get();

        return BookResource::collection($books);
    }

    public function show(Book $book)
    {
        // Generate a unique catch key for specific book
        $cacheKey = 'book_details_' . $book->id;

        // Try to retrieve the book from catch, or generate and catch the data
        $cacheBook = Cache::remember($cacheKey, now()->addDays(7), function () use ($book) {
            $book->pdf_url = URL::to('/api/books/file/' . basename($book->path));

            return $book;
        });

        return response()->json($cacheBook);
    }

    public function updateBook(Book $book, UpdateBookRequest $request)
    {
        Log::info($request->all());
        if($request->hasFile('pdf')){
            // Get the original name of the uploaded file
            $originalName = $request->file('pdf')->getClientOriginalName();

            // Get all file names in the database, check for duplicates except the current book's file name
            $fileNames = Book::pluck('file_name')->toArray();

            // Check if the uploaded file name already exists in the database (except for the current book)
            if (in_array($originalName, $fileNames) && $book->file_name !== $originalName) {
                return response()->json([
                    'errors' => [
                        'pdf' => ['The uploaded file already exist for this book. Please upload different file']
                    ]
                ]);
            }
            // Check if an existing file exists and delete it
            if ($book->path && Storage::disk('public')->exists($book->path)) {
                Storage::disk('public')->delete($book->path);
            }

            // Upload the new file with the same path
            $storeFileName = time() . '-' . $originalName;

            $path = $request->file('pdf')->storeAs('books', $storeFileName, 'public');

            Log::info('storeFileName: ' . $storeFileName);
            Log::info('path: ' . $path);

            // Update the 'path' and 'file_name' fields
            $book->path = $path;
            $book->file_name = $originalName;
        }
        
        // Update the title and author field
        $book->title = $request->title;
        $book->author = $request->author;

        // Save the change
        $book->save();

        return new BookResource($book);
    }
    public function destroy(Book $book)
    {
        $book->delete();
        
        if ($book->path && Storage::disk('public')->exists($book->path)) {
            Storage::disk('public')->delete($book->path);
        }

        return response()->json([
            'message' => 'Successfully delete ' . $book->title
        ]);
    }

    public function serveBook($filename)
    {
        $path = storage_path('app/public/books/' . $filename);

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Cache-Control' => 'public, max-age=604800',
            'Content-Type' => 'application/pdf',
        ]);
    }
}
