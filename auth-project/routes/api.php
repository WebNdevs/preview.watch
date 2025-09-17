<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// Sanctum routes
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Welcome to Admin Dashboard',
                'data' => [
                    'role' => 'admin',
                    'permissions' => ['manage_users', 'manage_agencies', 'manage_clients']
                ]
            ]);
        });
    });
    
    // Agency routes
    Route::middleware('role:agency')->group(function () {
        Route::get('/agency/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Welcome to Agency Dashboard',
                'data' => [
                    'role' => 'agency',
                    'permissions' => ['manage_clients', 'view_reports']
                ]
            ]);
        });
    });
    
    // Client routes
    Route::middleware('role:client')->group(function () {
        Route::get('/client/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Welcome to Client Dashboard',
                'data' => [
                    'role' => 'client',
                    'permissions' => ['view_profile', 'update_profile']
                ]
            ]);
        });
    });
});