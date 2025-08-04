<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = $this->getSettings();
        
        return Inertia::render('Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'nullable|string',
            'company_phone' => 'nullable|string|max:20',
            'company_email' => 'nullable|email',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'currency' => 'required|string|max:3',
            'low_stock_threshold' => 'required|integer|min:0',
            'receipt_footer' => 'nullable|string',
            'enable_customer_loyalty' => 'boolean',
            'enable_inventory_tracking' => 'boolean',
        ]);
        
        foreach ($validated as $key => $value) {
            Cache::forever("setting_{$key}", $value);
        }
        
        return back()->with('success', 'Settings updated successfully.');
    }

    private function getSettings()
    {
        return [
            'company_name' => Cache::get('setting_company_name', 'My Restaurant'),
            'company_address' => Cache::get('setting_company_address', ''),
            'company_phone' => Cache::get('setting_company_phone', ''),
            'company_email' => Cache::get('setting_company_email', ''),
            'tax_rate' => Cache::get('setting_tax_rate', 10),
            'currency' => Cache::get('setting_currency', 'IDR'),
            'low_stock_threshold' => Cache::get('setting_low_stock_threshold', 10),
            'receipt_footer' => Cache::get('setting_receipt_footer', 'Thank you for your visit!'),
            'enable_customer_loyalty' => Cache::get('setting_enable_customer_loyalty', false),
            'enable_inventory_tracking' => Cache::get('setting_enable_inventory_tracking', true),
        ];
    }
}