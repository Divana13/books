<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserLoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(UserLoginRequest $request)
    {
        $credential = $request->validated();

        if(Auth::attempt($credential)) {
            $user = Auth::user();

            // Delete token
            if ($user->tokens()->count() > 0){
                $user->tokens()->delete();
            }

            // Create new one
            $token = $user->createToken('main', ['*'], now()->addDays(3))->plainTextToken;

            return response()->json([
                'message' => 'Login successfully',
                'user' => $user->name,
                'token' => $token
            ]);
        } else {
            return response()->json([
                'message' => 'Login failed, Username or Password is not correct'
            ], 401);
        }
    }

    public function logout()
    {
        $user = Auth::user();

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
}
