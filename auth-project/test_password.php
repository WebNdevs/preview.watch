<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Testing password hashing...\n\n";

// Test 1: Create user with Hash::make
$testPassword = 'password123';
$hashedPassword = Hash::make($testPassword);
echo "Original password: $testPassword\n";
echo "Hashed password: $hashedPassword\n";
echo "Hash check result: " . (Hash::check($testPassword, $hashedPassword) ? 'PASS' : 'FAIL') . "\n\n";

// Test 2: Check existing user
$user = User::where('email', 'finaladmin@test.com')->first();
if ($user) {
    echo "User found: {$user->name} ({$user->email})\n";
    echo "Stored password hash: " . substr($user->password, 0, 50) . "...\n";
    echo "Password verification: " . (Hash::check('password123', $user->password) ? 'PASS' : 'FAIL') . "\n";
    echo "Auth attempt simulation: " . (auth()->attempt(['email' => $user->email, 'password' => 'password123']) ? 'PASS' : 'FAIL') . "\n";
} else {
    echo "User not found!\n";
}