<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'user_id', 
        'sale_date',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total',
        'cash_received',
        'change_returned',
        'note',
        'customer_id',
        'payment_method',
        'status',
        'table_number',  
        'order_type',
        'completed_at'
    ];

    protected $casts = [
        'sale_date' => 'datetime',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'cash_received' => 'decimal:2',
        'change_returned' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('sale_date', today());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('sale_date', now()->month)
                    ->whereYear('sale_date', now()->year);
    }

    // Methods
    public static function generateInvoiceNumber()
    {
        $date = now()->format('Ymd');
        $lastSale = self::whereDate('created_at', today())
                       ->orderBy('id', 'desc')
                       ->first();
        
        $sequence = $lastSale ? intval(substr($lastSale->invoice_number, -4)) + 1 : 1;
        
        return 'INV-' . $date . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    public function calculateTotals()
    {
        $this->subtotal = $this->saleItems()->sum('subtotal');
        $this->total = $this->subtotal + $this->tax_amount - $this->discount_amount;
        $this->change_returned = max(0, $this->cash_received - $this->total);
        $this->save();
    }
}
