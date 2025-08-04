<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use Faker\Factory as Faker;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Create some regular customers
        $customers = [
            [
                'name' => 'Budi Hartono',
                'phone' => '081234567801',
                'email' => 'budi.hartono@email.com',
                'address' => 'Jl. Merdeka No. 123, Jakarta Pusat',
                'birth_date' => '1985-03-15',
                'gender' => 'male',
                'total_spent' => 2500000,
                'visit_count' => 45,
                'is_active' => true,
            ],
            [
                'name' => 'Siti Rahayu',
                'phone' => '081234567802',
                'email' => 'siti.rahayu@email.com',
                'address' => 'Jl. Sudirman No. 456, Jakarta Selatan',
                'birth_date' => '1990-07-22',
                'gender' => 'female',
                'total_spent' => 1800000,
                'visit_count' => 32,
                'is_active' => true,
            ],
            [
                'name' => 'Ahmad Fauzi',
                'phone' => '081234567803',
                'email' => 'ahmad.fauzi@email.com',
                'address' => 'Jl. Thamrin No. 789, Jakarta Pusat',
                'birth_date' => '1988-12-05',
                'gender' => 'male',
                'total_spent' => 3200000,
                'visit_count' => 58,
                'is_active' => true,
            ],
            [
                'name' => 'Linda Permata',
                'phone' => '081234567804',
                'email' => 'linda.permata@email.com',
                'address' => 'Jl. Gatot Subroto No. 321, Jakarta Selatan',
                'birth_date' => '1992-09-18',
                'gender' => 'female',
                'total_spent' => 950000,
                'visit_count' => 18,
                'is_active' => true,
            ],
            [
                'name' => 'Rizki Pratama',
                'phone' => '081234567805',
                'email' => 'rizki.pratama@email.com',
                'address' => 'Jl. Kuningan No. 654, Jakarta Selatan',
                'birth_date' => '1995-01-28',
                'gender' => 'male',
                'total_spent' => 6500000,
                'visit_count' => 87,
                'is_active' => true,
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }

        // Create additional random customers
        for ($i = 1; $i <= 15; $i++) {
            Customer::create([
                'name' => $faker->name,
                'phone' => '0812345678' . str_pad($i + 10, 2, '0', STR_PAD_LEFT),
                'email' => $faker->email,
                'address' => $faker->address,
                'birth_date' => $faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
                'gender' => $faker->randomElement(['male', 'female']),
                'total_spent' => $faker->numberBetween(100000, 5000000),
                'visit_count' => $faker->numberBetween(1, 50),
                'is_active' => true,
            ]);
        }
    }
}
