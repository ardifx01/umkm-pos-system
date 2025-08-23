<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tax extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'rate',
        'is_inclusive',
        'is_active',
        'description'
    ];

    protected $casts = [
        'rate' => 'decimal:2',
        'is_inclusive' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Methods
    public function calculateTax($amount)
    {
        if (!$this->is_active || $this->rate <= 0) {
            return 0;
        }

        if ($this->is_inclusive) {
            // Tax included in price: tax = amount - (amount / (1 + rate/100))
            return round($amount - ($amount / (1 + $this->rate / 100)), 2);
        } else {
            // Tax excluded from price: tax = amount * (rate/100)
            return round($amount * ($this->rate / 100), 2);
        }
    }

    public function calculateAmountWithTax($baseAmount)
    {
        if (!$this->is_active || $this->rate <= 0) {
            return $baseAmount;
        }

        if ($this->is_inclusive) {
            return $baseAmount; // Tax already included
        } else {
            return round($baseAmount * (1 + $this->rate / 100), 2);
        }
    }

    // Accessors
    public function getFormattedRateAttribute()
    {
        return $this->rate . '%';
    }
}