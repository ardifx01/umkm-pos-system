<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Company Information
            [
                'key' => 'company_name',
                'value' => 'UMKM Store',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Nama perusahaan',
                'is_public' => true,
            ],
            [
                'key' => 'company_address',
                'value' => 'Jl. Contoh No. 123, Jakarta',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Alamat perusahaan',
                'is_public' => true,
            ],
            [
                'key' => 'company_phone',
                'value' => '021-12345678',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Nomor telepon perusahaan',
                'is_public' => true,
            ],
            [
                'key' => 'company_email',
                'value' => 'info@umkmstore.com',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Email perusahaan',
                'is_public' => true,
            ],
            
            // POS Settings
            [
                'key' => 'pos_auto_print_receipt',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'pos',
                'description' => 'Cetak struk otomatis setelah transaksi',
                'is_public' => false,
            ],
            [
                'key' => 'pos_receipt_footer',
                'value' => 'Terima kasih atas kunjungan Anda!',
                'type' => 'string',
                'group' => 'pos',
                'description' => 'Footer struk',
                'is_public' => true,
            ],
            [
                'key' => 'pos_default_tax_id',
                'value' => '1',
                'type' => 'integer',
                'group' => 'pos',
                'description' => 'Tax default untuk POS',
                'is_public' => false,
            ],
            [
                'key' => 'pos_allow_negative_stock',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'pos',
                'description' => 'Izinkan penjualan meski stok minus',
                'is_public' => false,
            ],
            
            // Inventory Settings
            [
                'key' => 'inventory_low_stock_alert',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'inventory',
                'description' => 'Aktifkan alert stok rendah',
                'is_public' => false,
            ],
            [
                'key' => 'inventory_expiry_alert_days',
                'value' => '7',
                'type' => 'integer',
                'group' => 'inventory',
                'description' => 'Alert produk kadaluarsa (hari)',
                'is_public' => false,
            ],
            [
                'key' => 'inventory_auto_generate_sku',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'inventory',
                'description' => 'Generate SKU otomatis',
                'is_public' => false,
            ],
            
            // System Settings
            [
                'key' => 'system_currency',
                'value' => 'IDR',
                'type' => 'string',
                'group' => 'system',
                'description' => 'Mata uang sistem',
                'is_public' => true,
            ],
            [
                'key' => 'system_currency_symbol',
                'value' => 'Rp',
                'type' => 'string',
                'group' => 'system',
                'description' => 'Simbol mata uang',
                'is_public' => true,
            ],
            [
                'key' => 'system_timezone',
                'value' => 'Asia/Jakarta',
                'type' => 'string',
                'group' => 'system',
                'description' => 'Timezone sistem',
                'is_public' => false,
            ],
            [
                'key' => 'system_date_format',
                'value' => 'd/m/Y',
                'type' => 'string',
                'group' => 'system',
                'description' => 'Format tanggal',
                'is_public' => true,
            ],
            [
                'key' => 'system_time_format',
                'value' => 'H:i',
                'type' => 'string',
                'group' => 'system',
                'description' => 'Format waktu',
                'is_public' => true,
            ],
            
            // Notification Settings
            [
                'key' => 'notification_email_enabled',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'notification',
                'description' => 'Aktifkan notifikasi email',
                'is_public' => false,
            ],
            [
                'key' => 'notification_sms_enabled',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'notification',
                'description' => 'Aktifkan notifikasi SMS',
                'is_public' => false,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}