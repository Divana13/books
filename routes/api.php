<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserBookProgressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/books/upload', [BookController::class, 'upload']);
    Route::put('/books/{book}', [BookController::class, 'updateBook']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('login', [AuthController::class, 'login']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/books/file/{filename}', [BookController::class, 'serveBook'])->middleware('cors');
Route::post('/progress/save', [UserBookProgressController::class, 'saveProgress']);
Route::get('/progress', [UserBookProgressController::class, 'getProgress']);