<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

echo "Testing Complete Login Flow with Remember Me...\n\n";

// Test 1: Login with Remember Me
echo "Test 1: Login with Remember Me\n";
echo "================================\n";

$admin = User::where('email', 'admin@test.com')->first();
if ($admin) {
    echo "✓ Admin user found: {$admin->name} ({$admin->email})\n";
    
    // Simulate login with remember me
    $authResult = Auth::attempt(['email' => 'admin@test.com', 'password' => 'password123']);
    if ($authResult) {
        echo "✓ Authentication successful\n";
        
        // Create token with remember me
        $rememberToken = Auth::user()->createToken('auth_token_remember')->plainTextToken;
        echo "✓ Remember Me Token created: " . substr($rememberToken, 0, 50) . "...\n";
        
        // Extract token ID
        $tokenParts = explode('|', $rememberToken);
        $tokenId = $tokenParts[0];
        $tokenHash = $tokenParts[1];
        
        echo "Token ID: {$tokenId}\n";
        echo "Token Hash: " . substr($tokenHash, 0, 20) . "...\n";
        
        // Test token validation
        $token = PersonalAccessToken::find($tokenId);
        if ($token) {
            echo "✓ Token found in database\n";
            echo "Token name: {$token->name}\n";
            echo "User ID: {$token->tokenable_id}\n";
            echo "Expires at: " . ($token->expires_at ? $token->expires_at : 'Never') . "\n";
            
            // Test if token can be used for authentication
            $user = $token->tokenable;
            if ($user) {
                echo "✓ Token can access user: {$user->email}\n";
                
                // Test API endpoint access with this token
                echo "\n--- Testing API Access ---\n";
                
                // Simulate a request with the token
                $request = new \Illuminate\Http\Request();
                $request->headers->set('Authorization', 'Bearer ' . $rememberToken);
                
                // Test if the token is valid
                $validToken = PersonalAccessToken::findToken($tokenHash);
                if ($validToken) {
                    echo "✓ Token hash validation successful\n";
                    
                    // Test user endpoint access
                    try {
                        $authController = new \App\Http\Controllers\AuthController();
                        $userResponse = $authController->user($request);
                        echo "✓ User endpoint accessible with token\n";
                        echo "Response status: " . $userResponse->getStatusCode() . "\n";
                    } catch (Exception $e) {
                        echo "✗ User endpoint failed: " . $e->getMessage() . "\n";
                    }
                } else {
                    echo "✗ Token hash validation failed\n";
                }
            } else {
                echo "✗ Token cannot access user\n";
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

// Test 2: Check token persistence
echo "Test 2: Token Persistence Check\n";
echo "================================\n";

$tokens = PersonalAccessToken::where('name', 'auth_token_remember')->get();
echo "Remember Me tokens found: " . $tokens->count() . "\n";

foreach ($tokens as $token) {
    $user = User::find($token->tokenable_id);
    echo "- Token ID: {$token->id}, User: " . ($user ? $user->email : 'Unknown') . "\n";
    echo "  Created: {$token->created_at}\n";
    echo "  Last used: " . ($token->last_used_at ? $token->last_used_at : 'Never') . "\n";
    
    // Test if token is still valid
    $tokenHash = $token->token;
    $validToken = PersonalAccessToken::findToken($tokenHash);
    if ($validToken) {
        echo "  ✓ Token is valid\n";
    } else {
        echo "  ✗ Token is invalid\n";
    }
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 3: Simulate frontend storage logic
echo "Test 3: Frontend Storage Logic Simulation\n";
echo "==========================================\n";

echo "This test simulates what the frontend should do:\n";
echo "1. Store token in localStorage when remember_me = true\n";
echo "2. Store token in sessionStorage when remember_me = false\n";
echo "3. Restore authentication state on page reload\n\n";

// Simulate localStorage
$localStorage = [];
$sessionStorage = [];

// Simulate login with remember me
$localStorage['auth_token'] = $rememberToken ?? 'test_token';
$localStorage['user'] = json_encode($admin->toArray());
$localStorage['remember_me'] = 'true';

echo "localStorage after login with remember me:\n";
foreach ($localStorage as $key => $value) {
    echo "  {$key}: " . substr($value, 0, 50) . "...\n";
}

// Simulate page reload
echo "\nSimulating page reload...\n";
$rememberMe = $localStorage['remember_me'] === 'true';
$token = $localStorage['auth_token'] ?? $sessionStorage['auth_token'];
$userData = $localStorage['user'] ?? $sessionStorage['user'];

if ($token && $userData) {
    echo "✓ Authentication data found on reload\n";
    echo "Remember me enabled: " . ($rememberMe ? 'Yes' : 'No') . "\n";
    
    if ($rememberMe) {
        echo "✓ Using localStorage for persistent storage\n";
        // Ensure data is in localStorage
        $localStorage['auth_token'] = $token;
        $localStorage['user'] = $userData;
        $localStorage['remember_me'] = 'true';
        // Clear sessionStorage
        unset($sessionStorage['auth_token']);
        unset($sessionStorage['user']);
    } else {
        echo "✓ Using sessionStorage for session-only storage\n";
        // Ensure data is in sessionStorage
        $sessionStorage['auth_token'] = $token;
        $sessionStorage['user'] = $userData;
        // Clear localStorage
        unset($localStorage['auth_token']);
        unset($localStorage['user']);
        unset($localStorage['remember_me']);
    }
    
    echo "Storage state after restoration:\n";
    echo "localStorage: " . count($localStorage) . " items\n";
    echo "sessionStorage: " . count($sessionStorage) . " items\n";
} else {
    echo "✗ No authentication data found on reload\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "Complete login flow test finished!\n";
