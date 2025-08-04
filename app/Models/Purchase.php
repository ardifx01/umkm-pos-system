<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'supplier_id',
        'user_id',
        'purchase_date',
        'total_amount',
        'status',
        'notes'
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    // Relationships
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    // Scopes
    public function scopeReceived($query)
    {
        return $query->where('status', 'received');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Methods
    public static function generateInvoiceNumber()
    {
        $date = now()->format('Ymd');
        $lastPurchase = self::whereDate('created_at', today())
                           ->orderBy('id', 'desc')
                           ->first();
        
        $sequence = $lastPurchase ? intval(substr($lastPurchase->invoice_number, -4)) + 1 : 1;
        
        return 'PO-' . $date . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    public function calculateTotal()
    {
        $this->total_amount = $this->purchaseItems()->sum('total_cost');
        $this->save();
    }

    public function receive()
    {
        if ($this->status !== 'pending') {
            return false;
        }

        foreach ($this->purchaseItems as $item) {
            $item->product->updateStock(
                $item->quantity,
                'in',
                'purchase',
                $this->id,
                "Received from purchase {$this->invoice_number}"
            );
        }

        $this->update(['status' => 'received']);
        return true;
    }
}
