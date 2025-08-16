<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Debugging password hashing...\n\n";

// Test 1: Direct Hash::make
$password = 'password123';
$directHash = Hash::make($password);
echo "Direct Hash::make result:\n";
echo "Password: $password\n";
echo "Hash: $directHash\n";
echo "Hash::check: " . (Hash::check($password, $directHash) ? 'PASS' : 'FAIL') . "\n\n";

// Test 2: Create user without mutator interference
echo "Creating user with direct password assignment...\n";
try {
    $user = new User();
    $user->name = 'Test Admin';
    $user->email = 'testadmin@test.com';
    $user->password = Hash::make('password123'); // Direct assignment
    $user->role = 'admin';
    $user->email_verified_at = now();
    $user->save();
    
    echo "✓ User created successfully!\n";
    echo "Stored password: " . substr($user->password, 0, 50) . "...\n";
    echo "Hash::check: " . (Hash::check('password123', $user->password) ? 'PASS' : 'FAIL') . "\n";
    
    // Test Auth::attempt
    echo "Auth::attempt: " . (auth()->attempt(['email' => $user->email, 'password' => 'password123']) ? 'PASS' : 'FAIL') . "\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 3: Check if there are any global password hashing issues
echo "Testing global password hashing...\n";
$testPasswords = ['password123', 'test123', 'admin123'];
foreach ($testPasswords as $testPass) {
    $hash = Hash::make($testPass);
    $check = Hash::check($testPass, $hash);
    echo "Password: $testPass -> Hash::check: " . ($check ? 'PASS' : 'FAIL') . "\n";
}

