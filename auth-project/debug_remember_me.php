<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

echo "Debugging Remember Me functionality...\n\n";

// Test 1: Check if admin user exists
echo "Test 1: Admin user authentication\n";
$admin = User::where('email', 'admin@test.com')->first();
if ($admin) {
    echo "✓ Admin user found: {$admin->name} ({$admin->email})\n";
    
    // Test password verification
    $password = 'password123';
    $isValid = Hash::check($password, $admin->password);
    echo "Password verification: " . ($isValid ? 'PASS' : 'FAIL') . "\n";
    
    // Test Auth::attempt
    $authResult = Auth::attempt(['email' => $admin->email, 'password' => $password]);
    echo "Auth::attempt: " . ($authResult ? 'PASS' : 'FAIL') . "\n";
    
    if ($authResult) {
        echo "✓ User authenticated successfully!\n";
        echo "User ID: " . Auth::id() . "\n";
        echo "User role: " . Auth::user()->role . "\n";
        
        // Test token creation with remember me
        echo "\n--- Testing Remember Me Token ---\n";
        $rememberToken = Auth::user()->createToken('auth_token_remember')->plainTextToken;
        echo "✓ Remember Me Token created: " . substr($rememberToken, 0, 50) . "...\n";
        
        // Check token in database
        $tokenParts = explode('|', $rememberToken);
        if (count($tokenParts) === 2) {
            $tokenId = $tokenParts[0];
            $token = PersonalAccessToken::find($tokenId);
            if ($token) {
                echo "✓ Token found in database\n";
                echo "Token name: " . $token->name . "\n";
                echo "Expires at: " . ($token->expires_at ? $token->expires_at : 'Never') . "\n";
                echo "Created at: " . $token->created_at . "\n";
                echo "Last used at: " . ($token->last_used_at ? $token->last_used_at : 'Never') . "\n";
            } else {
                echo "✗ Token not found in database\n";
            }
        }
        
        // Test regular token creation
        echo "\n--- Testing Regular Token ---\n";
        $regularToken = Auth::user()->createToken('auth_token')->plainTextToken;
        echo "✓ Regular Token created: " . substr($regularToken, 0, 50) . "...\n";
        
        // Check regular token in database
        $tokenParts = explode('|', $regularToken);
        if (count($tokenParts) === 2) {
            $tokenId = $tokenParts[0];
            $token = PersonalAccessToken::find($tokenId);
            if ($token) {
                echo "✓ Regular Token found in database\n";
                echo "Token name: " . $token->name . "\n";
                echo "Expires at: " . ($token->expires_at ? $token->expires_at : 'Never') . "\n";
                echo "Created at: " . $token->created_at . "\n";
            }
        }
        
        Auth::logout();
    } else {
        echo "✗ Authentication failed!\n";
    }
} else {
    echo "✗ Admin user not found!\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 2: Check all existing tokens
echo "Test 2: Checking existing tokens\n";
$tokens = PersonalAccessToken::where('tokenable_type', User::class)->get();
echo "Total tokens found: " . $tokens->count() . "\n";

foreach ($tokens as $token) {
    $user = User::find($token->tokenable_id);
    echo "- Token ID: {$token->id}, Name: {$token->name}, User: " . ($user ? $user->email : 'Unknown') . "\n";
    echo "  Expires at: " . ($token->expires_at ? $token->expires_at : 'Never') . "\n";
    echo "  Created: " . $token->created_at . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "Debug completed!\n";

