<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

echo "Testing login functionality...\n\n";

// Test 1: Check if admin user exists
$admin = User::where('email', 'admin@test.com')->first();
if ($admin) {
    echo "✓ Admin user found: {$admin->name} ({$admin->email})\n";
    echo "Role: {$admin->role}\n";
    echo "Password hash: " . substr($admin->password, 0, 50) . "...\n\n";
    
    // Test password verification
    $testPassword = 'password123';
    echo "Testing password: $testPassword\n";
    echo "Hash::check result: " . (Hash::check($testPassword, $admin->password) ? 'PASS' : 'FAIL') . "\n";
    
    // Test Auth::attempt
    echo "Auth::attempt result: " . (Auth::attempt(['email' => $admin->email, 'password' => $testPassword]) ? 'PASS' : 'FAIL') . "\n";
    
    // Test with different password
    echo "Auth::attempt with wrong password: " . (Auth::attempt(['email' => $admin->email, 'password' => 'wrongpassword']) ? 'PASS' : 'FAIL') . "\n";
    
} else {
    echo "✗ Admin user not found!\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 2: Check all users
echo "All users in database:\n";
$users = User::all();
foreach ($users as $user) {
    echo "- {$user->name} ({$user->email}) - Role: {$user->role}\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Test 3: Try to recreate admin user with correct password
echo "Recreating admin user with correct password...\n";
try {
    // Delete existing admin
    User::where('email', 'admin@test.com')->delete();
    
    // Create new admin
    $newAdmin = User::create([
        'name' => 'Admin User',
        'email' => 'admin@test.com',
        'password' => Hash::make('password123'),
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    
    echo "✓ New admin user created successfully!\n";
    echo "Password verification: " . (Hash::check('password123', $newAdmin->password) ? 'PASS' : 'FAIL') . "\n";
    echo "Auth::attempt: " . (Auth::attempt(['email' => $newAdmin->email, 'password' => 'password123']) ? 'PASS' : 'FAIL') . "\n";
    
} catch (Exception $e) {
    echo "✗ Error creating admin user: " . $e->getMessage() . "\n";
}

