<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

echo "Testing Token Validation...\n\n";

// Test 1: Create a token and validate it
echo "Test 1: Token Creation and Validation\n";
echo "=====================================\n";

$admin = User::where('email', 'admin@test.com')->first();
if ($admin) {
    echo "✓ Admin user found: {$admin->name} ({$admin->email})\n";
    
    // Authenticate user
    $authResult = Auth::attempt(['email' => 'admin@test.com', 'password' => 'password123']);
    if ($authResult) {
        echo "✓ User authenticated\n";
        
        // Create a token
        $token = Auth::user()->createToken('test_token')->plainTextToken;
        echo "✓ Token created: " . substr($token, 0, 50) . "...\n";
        
        // Extract token parts
        $tokenParts = explode('|', $token);
        $tokenId = $tokenParts[0];
        $tokenHash = $tokenParts[1];
        
        echo "Token ID: {$tokenId}\n";
        echo "Token Hash: " . substr($tokenHash, 0, 20) . "...\n";
        
        // Test token validation
        $validToken = PersonalAccessToken::findToken($tokenHash);
        if ($validToken) {
            echo "✓ Token validation successful\n";
            echo "Token name: {$validToken->name}\n";
            echo "User ID: {$validToken->tokenable_id}\n";
            
            // Test if token can access user
            $user = $validToken->tokenable;
            if ($user) {
                echo "✓ Token can access user: {$user->email}\n";
            } else {
                echo "✗ Token cannot access user\n";
            }
        } else {
            echo "✗ Token validation failed\n";
        }
        
        // Test database lookup
        $dbToken = PersonalAccessToken::find($tokenId);
        if ($dbToken) {
            echo "✓ Token found in database\n";
            echo "Database token hash: " . substr($dbToken->token, 0, 20) . "...\n";
            
            // Compare hashes
            if (hash_equals($dbToken->token, $tokenHash)) {
                echo "✓ Token hashes match\n";
            } else {
                echo "✗ Token hashes do not match\n";
            }
        } else {
            echo "✗ Token not found in database\n";
        }
        
        Auth::logout();
    } else {
        echo "✗ Authentication failed\n";
    }
} else {
    echo "✗ Admin user not found\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 2: Test API endpoint with token
echo "Test 2: API Endpoint Access with Token\n";
echo "======================================\n";

if (isset($token)) {
    echo "Using token: " . substr($token, 0, 50) . "...\n";
    
    // Create a request with the token
    $request = new \Illuminate\Http\Request();
    $request->headers->set('Authorization', 'Bearer ' . $token);
    
    // Test the user endpoint
    try {
        $authController = new \App\Http\Controllers\AuthController();
        $response = $authController->user($request);
        echo "✓ User endpoint accessible with token\n";
        echo "Response status: " . $response->getStatusCode() . "\n";
        echo "Response content: " . $response->getContent() . "\n";
    } catch (Exception $e) {
        echo "✗ User endpoint failed: " . $e->getMessage() . "\n";
    }
} else {
    echo "No token available for testing\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "Token validation test completed!\n";

