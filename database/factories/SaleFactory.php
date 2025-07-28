<?php

namespace Database\Factories;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    protected $model = Sale::class;

    public function definition(): array
    {
        $total = $this->faker->randomFloat(2, 50000, 300000);
        $cash = $total + $this->faker->randomFloat(2, 1000, 20000);

        return [
            'user_id' => User::factory(),
            'sale_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'total' => $total,
            'cash_received' => $cash,
            'change_returned' => $cash - $total,
            'note' => $this->faker->optional()->sentence(),
        ];
    }
}
