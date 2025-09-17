<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'sometimes|in:admin,agency,client',
            'remember_me' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role ?? 'client'
        ]);

        // Create token with appropriate expiration
        $tokenName = $request->input('remember_me') ? 'auth_token_remember' : 'auth_token';
        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
            'remember_me' => $request->input('remember_me', false)
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'remember_me' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422)->header('Access-Control-Allow-Origin', 'http://localhost:3000')
                   ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                   ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                   ->header('Access-Control-Allow-Credentials', 'true');
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401)->header('Access-Control-Allow-Origin', 'http://localhost:3000')
                   ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                   ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                   ->header('Access-Control-Allow-Credentials', 'true');
        }

        $user = Auth::user();
        
        // Create token with appropriate expiration
        $tokenName = $request->input('remember_me') ? 'auth_token_remember' : 'auth_token';
        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'remember_me' => $request->input('remember_me', false)
        ])->header('Access-Control-Allow-Origin', 'http://localhost:3000')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
          ->header('Access-Control-Allow-Credentials', 'true');
    }

    public function logout(Request $request)
    {
        try {
            // Check if user is authenticated
            if ($request->user()) {
                // Delete the current access token
                $request->user()->currentAccessToken()->delete();
            } else {
                // If no user is authenticated, try to get the token from the Authorization header
                $token = $request->bearerToken();
                if ($token) {
                    // Find and delete the token manually
                    $tokenParts = explode('|', $token);
                    if (count($tokenParts) === 2) {
                        $tokenId = $tokenParts[0];
                        $personalAccessToken = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                        if ($personalAccessToken) {
                            $personalAccessToken->delete();
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ])->header('Access-Control-Allow-Origin', 'http://localhost:3000')
              ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
              ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
              ->header('Access-Control-Allow-Credentials', 'true');
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Logout error: ' . $e->getMessage());
            
            // Return success anyway since the frontend will clear the token
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ])->header('Access-Control-Allow-Origin', 'http://localhost:3000')
              ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
              ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
              ->header('Access-Control-Allow-Credentials', 'true');
        }
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to send reset link'
        ], 500);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = $password;
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid token or email'
        ], 400);
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user) {
                return response()->json([
                    'success' => true,
                    'user' => $user
                ])->header('Access-Control-Allow-Origin', 'http://localhost:3000')
                  ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                  ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                  ->header('Access-Control-Allow-Credentials', 'true');
            } else {
                // If no user is authenticated, try to get the token and validate it manually
                $token = $request->bearerToken();
                if ($token) {
                    $tokenParts = explode('|', $token);
                    if (count($tokenParts) === 2) {
                        $tokenId = $tokenParts[0];
                        $personalAccessToken = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                        if ($personalAccessToken) {
                            $user = $personalAccessToken->tokenable;
                            if ($user) {
                                return response()->json([
                                    'success' => true,
                                    'user' => $user
                                ])->header('Access-Control-Allow-Origin', 'http://localhost:3000')
                                  ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                                  ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                                  ->header('Access-Control-Allow-Credentials', 'true');
                            }
                        }
                    }
                }
                
                // No valid user found
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401)->header('Access-Control-Allow-Origin', 'http://localhost:3000')
                  ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                  ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                  ->header('Access-Control-Allow-Credentials', 'true');
            }
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('User endpoint error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Internal server error'
            ], 500)->header('Access-Control-Allow-Origin', 'http://localhost:3000')
              ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
              ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
              ->header('Access-Control-Allow-Credentials', 'true');
        }
    }
}
