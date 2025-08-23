<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'icon',
        'requires_reference',
        'fee_percentage',
        'fee_amount',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'requires_reference' => 'boolean',
        'fee_percentage' => 'decimal:2',
        'fee_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    // Methods
    public function calculateFee($amount)
    {
        $fee = 0;
        
        if ($this->fee_percentage > 0) {
            $fee += ($amount * $this->fee_percentage / 100);
        }
        
        if ($this->fee_amount > 0) {
            $fee += $this->fee_amount;
        }
        
        return round($fee, 2);
    }

    // Accessors
    public function getHasFeeAttribute()
    {
        return $this->fee_percentage > 0 || $this->fee_amount > 0;
    }
}