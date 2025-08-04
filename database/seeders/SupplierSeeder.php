<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'PT Indofood Sukses Makmur',
                'contact_person' => 'Budi Santoso',
                'phone' => '0215678901',
                'email' => 'sales@indofood.co.id',
                'address' => 'Jl. Sudirman Kav 76-78, Jakarta Selatan',
                'is_active' => true,
            ],
            [
                'name' => 'CV Sumber Rejeki',
                'contact_person' => 'Siti Nurhaliza',
                'phone' => '0223456789',
                'email' => 'info@sumberrejeki.com',
                'address' => 'Jl. Raya Bogor KM 25, Depok',
                'is_active' => true,
            ],
            [
                'name' => 'UD Maju Bersama',
                'contact_person' => 'Ahmad Wijaya',
                'phone' => '0218765432',
                'email' => 'ahmad@majubersama.co.id',
                'address' => 'Jl. Fatmawati No. 123, Jakarta Selatan',
                'is_active' => true,
            ],
            [
                'name' => 'Toko Grosir Harapan',
                'contact_person' => 'Linda Sari',
                'phone' => '0219876543',
                'email' => 'linda@grosirharapan.com',
                'address' => 'Jl. Pasar Minggu Raya No. 45, Jakarta Selatan',
                'is_active' => true,
            ],
            [
                'name' => 'PT Nestle Indonesia',
                'contact_person' => 'Robert Chen',
                'phone' => '0214567890',
                'email' => 'sales@nestle.co.id',
                'address' => 'Jl. TB Simatupang Kav 88, Jakarta Selatan',
                'is_active' => true,
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}