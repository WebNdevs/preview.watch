<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

echo "Testing API endpoints...\n\n";

// Test 1: Check if admin user exists and can authenticate
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
        
        // Test token creation
        $token = Auth::user()->createToken('test_token')->plainTextToken;
        echo "✓ Token created: " . substr($token, 0, 50) . "...\n";
        
        Auth::logout();
    }
} else {
    echo "✗ Admin user not found!\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 2: Simulate the login process
echo "Test 2: Simulating login process\n";
try {
    $request = new \Illuminate\Http\Request();
    $request->merge([
        'email' => 'admin@test.com',
        'password' => 'password123'
    ]);
    
    $authController = new \App\Http\Controllers\AuthController();
    $response = $authController->login($request);
    
    echo "✓ Login response generated\n";
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo "Response content: " . $response->getContent() . "\n";
    
} catch (Exception $e) {
    echo "✗ Error testing login: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "API test completed!\n";

