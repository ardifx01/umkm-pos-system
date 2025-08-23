<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'name',
        'email', 
        'phone',
        'password',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
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

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function cashRegisters()
    {
        return $this->hasMany(CashRegister::class);
    }

    public function currentCashRegister()
    {
        return $this->hasOne(CashRegister::class)->where('status', 'open');
    }

    // Helper methods
    public function isOwner(): bool
    {
        return $this->hasRole('owner');
    }

    public function isManager(): bool
    {
        return $this->hasRole('manager');
    }

    public function isCashier(): bool
    {
        return $this->hasRole('cashier');
    }

    public function canManageStock(): bool
    {
        return $this->can('manage stock');
    }

    public function canProcessRefunds(): bool
    {
        return $this->can('process refunds');
    }

    public function hasOpenCashRegister()
    {
        return $this->currentCashRegister()->exists();
    }

    public function openCashRegister($openingBalance = 0, $notes = null)
    {
        if ($this->hasOpenCashRegister()) {
            return false; // User already has open cash register
        }

        return CashRegister::create([
            'user_id' => $this->id,
            'opening_balance' => $openingBalance,
            'shift_number' => CashRegister::generateShiftNumber(),
            'opened_at' => now(),
            'status' => 'open',
            'notes' => $notes
        ]);
    }

    // Scope
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getUserPermissions()
    {
        return $this->getAllPermissions();
    }

    
}