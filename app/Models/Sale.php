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
        'customer_id',
        'cash_register_id', 
        'payment_method_id', 
        'tax_id', 
        'sale_date',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total',
        'cash_received',
        'change_returned',
        'payment_reference', 
        'note',
        'status',
        'table_number',
        'order_type',
        'refund_reason', 
        'refunded_at', 
        'refunded_by', 
        'print_count', 
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
        'print_count' => 'integer',
        'completed_at' => 'datetime',
        'refunded_at' => 'datetime',
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

    public function cashRegister()
    {
        return $this->belongsTo(CashRegister::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class);
    }

    public function refundedBy()
    {
        return $this->belongsTo(User::class, 'refunded_by');
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
        
        // Calculate tax
        if ($this->tax && $this->tax->is_active) {
            $this->tax_amount = $this->tax->calculateTax($this->subtotal);
        }
        
        $this->total = $this->subtotal + $this->tax_amount - $this->discount_amount;
        $this->change_returned = max(0, $this->cash_received - $this->total);
        $this->save();
        
        return $this;
    }

    public function processRefund($reason = null, $userId = null)
    {
        if ($this->status !== 'completed') {
            return false;
        }

        // Return stock for tracked products
        foreach ($this->saleItems as $item) {
            if ($item->product && $item->product->track_stock) {
                $item->product->updateStock(
                    $item->quantity,
                    'in',
                    'refund',
                    $this->id,
                    "Refund for sale {$this->invoice_number}"
                );
            }
        }

        // Update cash register if still open
        if ($this->cashRegister && $this->cashRegister->status === 'open') {
            $this->cashRegister->total_refunds += $this->total;
            
            if ($this->paymentMethod && $this->paymentMethod->code === 'cash') {
                $this->cashRegister->total_cash_sales -= $this->total;
            }
            
            $this->cashRegister->save();
        }

        $this->update([
            'status' => 'refunded',
            'refund_reason' => $reason,
            'refunded_at' => now(),
            'refunded_by' => $userId ?? auth()->id()
        ]);

        return true;
    }
}
