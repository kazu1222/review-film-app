<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($media_type, $media_id )
    {
        $reviews = Review::with('user')
        ->where('media_type',$media_type)
        ->where('media_id', $media_id)
        ->get();

        return response()->json($reviews);
    }

    public function test()
    {
        $reviews = Review::all();

        return response()->json($reviews);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validateDate = $request->validate([
            "content" => 'required|string',
            "rating" => 'required|integer',
            "media_type" => 'required|string',
            "media_id" => 'required|integer',
            "content" => 'required|string',
        ]);

        $review = Review::create([
            "user_id" => Auth::id(),
            "content" => $validateDate["content"],
            "rating" => $validateDate["rating"],
            "media_type" => $validateDate["media_type"],
            "media_id" => $validateDate["media_id"]
        ]);

        $review->load('user');
        return response()->json($review);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json(["message" => "正常にレビューを削除しました。"]);
    }
}
