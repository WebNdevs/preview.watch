<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Creating test users...\n";

// Create Admin User
$admin = User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'email_verified_at' => now(),
]);
echo "✓ Admin user created: admin@test.com (password: password123)\n";

// Create Agency User
$agency = User::create([
    'name' => 'Agency Manager',
    'email' => 'agency@test.com',
    'password' => Hash::make('password123'),
    'role' => 'agency',
    'email_verified_at' => now(),
]);
echo "✓ Agency user created: agency@test.com (password: password123)\n";

// Create Client User
$client = User::create([
    'name' => 'Client User',
    'email' => 'client@test.com',
    'password' => Hash::make('password123'),
    'role' => 'client',
    'email_verified_at' => now(),
]);
echo "✓ Client user created: client@test.com (password: password123)\n";

// Create additional test users
$users = [
    ['name' => 'John Admin', 'email' => 'john@admin.com', 'role' => 'admin'],
    ['name' => 'Sarah Agency', 'email' => 'sarah@agency.com', 'role' => 'agency'],
    ['name' => 'Mike Client', 'email' => 'mike@client.com', 'role' => 'client'],
    ['name' => 'Lisa Client', 'email' => 'lisa@client.com', 'role' => 'client'],
    ['name' => 'Tom Agency', 'email' => 'tom@agency.com', 'role' => 'agency'],
];

foreach ($users as $userData) {
    User::create([
        'name' => $userData['name'],
        'email' => $userData['email'],
        'password' => Hash::make('password123'),
        'role' => $userData['role'],
        'email_verified_at' => now(),
    ]);
    echo "✓ {$userData['role']} user created: {$userData['email']} (password: password123)\n";
}

echo "\n" . User::count() . " total users created successfully!\n";
echo "\nTest credentials:\n";
echo "Admin: admin@test.com / password123\n";
echo "Agency: agency@test.com / password123\n";
echo "Client: client@test.com / password123\n";
echo "\nYou can now test the authentication system!\n";