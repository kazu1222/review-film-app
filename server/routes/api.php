<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\FavoriteController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

//コメント
Route::get('reviews/{media_type}/{media_id}', [ReviewController::class, 'index']);
Route::post('reviews', [ReviewController::class, 'store']);
Route::delete('review/{review}', [ReviewController::class, 'destroy']);
Route::put('review/{review}', [ReviewController::class, 'update']);

//お気に入り
Route::post('favorites', [FavoriteController::class, 'toggleFavorite']);
Route::get('favorites/status', [FavoriteController::class, 'checkFavoritesStatus']);