<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashRegister extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'opening_balance',
        'closing_balance',
        'expected_cash',
        'actual_cash',
        'cash_difference',
        'total_sales',
        'total_refunds',
        'total_cash_sales',
        'total_card_sales',
        'total_transfer_sales',
        'transaction_count',
        'opened_at',
        'closed_at',
        'status',
        'notes',
        'shift_number'
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'closing_balance' => 'decimal:2',
        'expected_cash' => 'decimal:2',
        'actual_cash' => 'decimal:2',
        'cash_difference' => 'decimal:2',
        'total_sales' => 'decimal:2',
        'total_refunds' => 'decimal:2',
        'total_cash_sales' => 'decimal:2',
        'total_card_sales' => 'decimal:2',
        'total_transfer_sales' => 'decimal:2',
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('opened_at', today());
    }

    // Methods
    public static function generateShiftNumber()
    {
        $today = now()->format('Ymd');
        $lastShift = self::whereDate('opened_at', today())
                        ->orderBy('id', 'desc')
                        ->first();
        
        $sequence = $lastShift ? intval(substr($lastShift->shift_number, -3)) + 1 : 1;
        
        return 'SH-' . $today . '-' . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }

    public function calculateExpectedCash()
    {
        $this->expected_cash = $this->opening_balance + $this->total_cash_sales - $this->total_refunds;
        $this->save();
        return $this;
    }

    public function calculateDifference()
    {
        $this->cash_difference = $this->actual_cash - $this->expected_cash;
        $this->save();
        return $this;
    }

    public function closeShift($actualCash, $notes = null)
    {
        $this->actual_cash = $actualCash;
        $this->calculateExpectedCash();
        $this->calculateDifference();
        $this->closing_balance = $actualCash;
        $this->closed_at = now();
        $this->status = 'closed';
        $this->notes = $notes;
        $this->save();

        return $this;
    }

    // Accessors
    public function getShiftDurationAttribute()
    {
        if (!$this->closed_at) {
            return $this->opened_at->diffForHumans();
        }
        return $this->opened_at->diffInHours($this->closed_at) . ' hours';
    }

    public function getIsBalancedAttribute()
    {
        return abs($this->cash_difference) < 0.01; // Balanced if difference < 1 cent
    }
}