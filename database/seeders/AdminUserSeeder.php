<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['phone' => '5550000001'],
            [
                'name' => 'Admin User',
                'password' => 'password',
                'is_admin' => true,
            ]
        );
    }
}
