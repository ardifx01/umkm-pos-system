<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(), 
            'name' => $this->faker->word(),
            'sku' => strtoupper($this->faker->bothify('PRD###')),
            'purchase_price' => $this->faker->randomFloat(2, 1000, 20000),
            'selling_price' => $this->faker->randomFloat(2, 20000, 50000),
            'stock' => $this->faker->numberBetween(10, 100),
            'unit' => $this->faker->randomElement(['pcs', 'kg', 'liter']),
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
