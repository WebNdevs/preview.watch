<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

echo "Testing Logout Functionality...\n\n";

// Test 1: Test logout without authentication (should not cause 500 error)
echo "Test 1: Logout without authentication\n";
echo "=====================================\n";

try {
    $request = new \Illuminate\Http\Request();
    $authController = new \App\Http\Controllers\AuthController();
    $response = $authController->logout($request);
    
    echo "✓ Logout successful without authentication\n";
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo "Response content: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "✗ Logout failed: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 2: Test logout with a valid token
echo "Test 2: Logout with valid token\n";
echo "================================\n";

$admin = User::where('email', 'admin@test.com')->first();
if ($admin) {
    echo "✓ Admin user found: {$admin->name} ({$admin->email})\n";
    
    // Authenticate user and create token
    $authResult = Auth::attempt(['email' => 'admin@test.com', 'password' => 'password123']);
    if ($authResult) {
        echo "✓ User authenticated\n";
        
        // Create a token
        $token = Auth::user()->createToken('test_logout_token')->plainTextToken;
        echo "✓ Token created: " . substr($token, 0, 50) . "...\n";
        
        // Test logout with token
        try {
            $request = new \Illuminate\Http\Request();
            $request->headers->set('Authorization', 'Bearer ' . $token);
            $authController = new \App\Http\Controllers\AuthController();
            $response = $authController->logout($request);
            
            echo "✓ Logout successful with valid token\n";
            echo "Response status: " . $response->getStatusCode() . "\n";
            echo "Response content: " . $response->getContent() . "\n";
            
            // Verify token was deleted
            $tokenParts = explode('|', $token);
            $tokenId = $tokenParts[0];
            $deletedToken = PersonalAccessToken::find($tokenId);
            if ($deletedToken) {
                echo "✗ Token still exists after logout\n";
            } else {
                echo "✓ Token successfully deleted after logout\n";
            }
        } catch (Exception $e) {
            echo "✗ Logout failed: " . $e->getMessage() . "\n";
        }
        
        Auth::logout();
    } else {
        echo "✗ Authentication failed\n";
    }
} else {
    echo "✗ Admin user not found\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 3: Test logout with invalid token
echo "Test 3: Logout with invalid token\n";
echo "==================================\n";

try {
    $request = new \Illuminate\Http\Request();
    $request->headers->set('Authorization', 'Bearer invalid_token_123');
    $authController = new \App\Http\Controllers\AuthController();
    $response = $authController->logout($request);
    
    echo "✓ Logout successful with invalid token\n";
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo "Response content: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "✗ Logout failed: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "Logout functionality test completed!\n";

