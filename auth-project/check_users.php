<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Checking users in database...\n\n";

$users = User::all();
echo "Total users: " . $users->count() . "\n\n";

foreach ($users as $user) {
    echo "ID: {$user->id}\n";
    echo "Name: {$user->name}\n";
    echo "Email: {$user->email}\n";
    echo "Role: {$user->role}\n";
    echo "Password Hash: " . substr($user->password, 0, 30) . "...\n";
    echo "Created: {$user->created_at}\n";
    echo "---\n";
}

// Test password verification
echo "\nTesting password verification for admin@test.com:\n";
$admin = User::where('email', 'admin@test.com')->first();
if ($admin) {
    $passwordCheck = Hash::check('password123', $admin->password);
    echo "Password 'password123' is " . ($passwordCheck ? 'CORRECT' : 'INCORRECT') . "\n";
} else {
    echo "Admin user not found!\n";
}