<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $paymentMethods = [
            [
                'name' => 'Cash',
                'code' => 'cash',
                'icon' => 'money-bill',
                'requires_reference' => false,
                'fee_percentage' => 0,
                'fee_amount' => 0,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Debit Card',
                'code' => 'debit_card',
                'icon' => 'credit-card',
                'requires_reference' => false,
                'fee_percentage' => 0,
                'fee_amount' => 0,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Credit Card',
                'code' => 'credit_card',
                'icon' => 'credit-card',
                'requires_reference' => false,
                'fee_percentage' => 2.5,
                'fee_amount' => 0,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Bank Transfer',
                'code' => 'bank_transfer',
                'icon' => 'university',
                'requires_reference' => true,
                'fee_percentage' => 0,
                'fee_amount' => 6500,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'E-Wallet (OVO)',
                'code' => 'ovo',
                'icon' => 'mobile-alt',
                'requires_reference' => true,
                'fee_percentage' => 0.7,
                'fee_amount' => 0,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'E-Wallet (GoPay)',
                'code' => 'gopay',
                'icon' => 'mobile-alt',
                'requires_reference' => true,
                'fee_percentage' => 0.7,
                'fee_amount' => 0,
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'E-Wallet (DANA)',
                'code' => 'dana',
                'icon' => 'mobile-alt',
                'requires_reference' => true,
                'fee_percentage' => 0.7,
                'fee_amount' => 0,
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'QRIS',
                'code' => 'qris',
                'icon' => 'qrcode',
                'requires_reference' => true,
                'fee_percentage' => 0.7,
                'fee_amount' => 0,
                'is_active' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($paymentMethods as $method) {
            PaymentMethod::create($method);
        }
    }
}