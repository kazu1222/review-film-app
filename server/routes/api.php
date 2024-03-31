<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('reviews/{media_type}/{media_id}', [ReviewController::class, 'index']);
Route::get('review', [ReviewController::class, 'test']);
