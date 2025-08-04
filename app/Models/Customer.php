<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'birth_date',
        'gender',
        'total_spent',
        'visit_count',
        'is_active'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'total_spent' => 'decimal:2',
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
        return $query->where('is_active', true);
    }

    public function scopeVip($query, $minSpent = 1000000)
    {
        return $query->where('total_spent', '>=', $minSpent);
    }

    // Methods
    public function updateStats()
    {
        $this->total_spent = $this->sales()->where('status', 'completed')->sum('total');
        $this->visit_count = $this->sales()->where('status', 'completed')->count();
        $this->save();
    }

    public function getCustomerLevelAttribute()
    {
        if ($this->total_spent >= 5000000) return 'VIP';
        if ($this->total_spent >= 2000000) return 'Gold';
        if ($this->total_spent >= 500000) return 'Silver';
        return 'Bronze';
    }
}
