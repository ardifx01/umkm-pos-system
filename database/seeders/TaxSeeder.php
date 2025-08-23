<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tax;

class TaxSeeder extends Seeder
{
    public function run(): void
    {
        $taxes = [
            [
                'name' => 'PPN 11%',
                'code' => 'ppn_11',
                'rate' => 11.00,
                'is_inclusive' => false,
                'is_active' => true,
                'description' => 'Pajak Pertambahan Nilai 11%',
            ],
            [
                'name' => 'PPN 11% (Include)',
                'code' => 'ppn_11_inc',
                'rate' => 11.00,
                'is_inclusive' => true,
                'is_active' => false,
                'description' => 'Pajak Pertambahan Nilai 11% (sudah termasuk dalam harga)',
            ],
            [
                'name' => 'Service Charge 10%',
                'code' => 'service_10',
                'rate' => 10.00,
                'is_inclusive' => false,
                'is_active' => false,
                'description' => 'Service Charge 10%',
            ],
        ];

        foreach ($taxes as $tax) {
            Tax::create($tax);
        }
    }
}