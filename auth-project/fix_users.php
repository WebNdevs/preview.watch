<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Fixing user passwords...\n\n";

// Clear all existing users
echo "Clearing existing users...\n";
User::truncate();
echo "✓ All users cleared\n\n";

// Create Admin User
echo "Creating admin user...\n";
$admin = User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'email_verified_at' => now(),
]);
echo "✓ Admin user created: admin@test.com (password: password123)\n";

// Test the admin user
echo "Testing admin user login...\n";
$testResult = Hash::check('password123', $admin->password);
echo "Password verification: " . ($testResult ? 'PASS' : 'FAIL') . "\n";

// Test Auth::attempt
$authResult = auth()->attempt(['email' => 'admin@test.com', 'password' => 'password123']);
echo "Auth::attempt: " . ($authResult ? 'PASS' : 'FAIL') . "\n";

if ($authResult) {
    echo "✓ Login successful! User ID: " . auth()->id() . "\n";
    auth()->logout();
} else {
    echo "✗ Login failed!\n";
}

echo "\n" . str_repeat("=", 50) . "\n";

// Create Agency User
echo "Creating agency user...\n";
$agency = User::create([
    'name' => 'Agency Manager',
    'email' => 'agency@test.com',
    'password' => Hash::make('password123'),
    'role' => 'agency',
    'email_verified_at' => now(),
]);
echo "✓ Agency user created: agency@test.com (password: password123)\n";

// Create Client User
echo "Creating client user...\n";
$client = User::create([
    'name' => 'Client User',
    'email' => 'client@test.com',
    'password' => Hash::make('password123'),
    'role' => 'client',
    'email_verified_at' => now(),
]);
echo "✓ Client user created: client@test.com (password: password123)\n";

echo "\n" . str_repeat("=", 50) . "\n";
echo "Test credentials:\n";
echo "Admin: admin@test.com / password123\n";
echo "Agency: agency@test.com / password123\n";
echo "Client: client@test.com / password123\n";
echo "\nYou can now test the authentication system!\n";

