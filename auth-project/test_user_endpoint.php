<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

echo "Testing User Endpoint Functionality...\n\n";

// Test 1: Test user endpoint without authentication
echo "Test 1: User endpoint without authentication\n";
echo "===========================================\n";

try {
    $request = new \Illuminate\Http\Request();
    $authController = new \App\Http\Controllers\AuthController();
    $response = $authController->user($request);
    
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo "Response content: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "✗ User endpoint failed: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 2: Test user endpoint with valid token
echo "Test 2: User endpoint with valid token\n";
echo "=====================================\n";

$admin = User::where('email', 'admin@test.com')->first();
if ($admin) {
    echo "✓ Admin user found: {$admin->name} ({$admin->email})\n";
    
    // Authenticate user and create token
    $authResult = Auth::attempt(['email' => 'admin@test.com', 'password' => 'password123']);
    if ($authResult) {
        echo "✓ User authenticated\n";
        
        // Create a token
        $token = Auth::user()->createToken('test_user_token')->plainTextToken;
        echo "✓ Token created: " . substr($token, 0, 50) . "...\n";
        
        // Test user endpoint with token
        try {
            $request = new \Illuminate\Http\Request();
            $request->headers->set('Authorization', 'Bearer ' . $token);
            $authController = new \App\Http\Controllers\AuthController();
            $response = $authController->user($request);
            
            echo "✓ User endpoint successful with valid token\n";
            echo "Response status: " . $response->getStatusCode() . "\n";
            echo "Response content: " . $response->getContent() . "\n";
        } catch (Exception $e) {
            echo "✗ User endpoint failed: " . $e->getMessage() . "\n";
        }
        
        Auth::logout();
    } else {
        echo "✗ Authentication failed\n";
    }
} else {
    echo "✗ Admin user not found\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 3: Test user endpoint with invalid token
echo "Test 3: User endpoint with invalid token\n";
echo "========================================\n";

try {
    $request = new \Illuminate\Http\Request();
    $request->headers->set('Authorization', 'Bearer invalid_token_123');
    $authController = new \App\Http\Controllers\AuthController();
    $response = $authController->user($request);
    
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo "Response content: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "✗ User endpoint failed: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "User endpoint functionality test completed!\n";

