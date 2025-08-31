<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function index(Request $request)
    {
        $query = PaymentMethod::query();

        // Search functionality
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status);
        }

        $paymentMethods = $query->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('PaymentMethods/Index', [
            'paymentMethods' => $paymentMethods,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function create()
    {
        return Inertia::render('PaymentMethods/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:payment_methods,code',
            'icon' => 'nullable|string|max:255',
            'requires_reference' => 'boolean',
            'fee_percentage' => 'nullable|numeric|min:0|max:100',
            'fee_amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0'
        ]);

        $data = $request->all();
        
        // Set default values
        $data['requires_reference'] = $request->boolean('requires_reference');
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $request->sort_order ?? 0;

        // Ensure at least one fee type is set if any fee is provided
        if (($request->fee_percentage > 0 || $request->fee_amount > 0) && 
            (!$request->fee_percentage && !$request->fee_amount)) {
            return redirect()->back()
                ->withErrors(['fee' => 'Please specify either fee percentage or fee amount'])
                ->withInput();
        }

        PaymentMethod::create($data);

        return redirect()->route('payment-methods.index')
            ->with('success', 'Payment method created successfully.');
    }

    public function show(PaymentMethod $paymentMethod)
    {
        $paymentMethod->load(['sales' => function($query) {
            $query->latest()->take(10);
        }]);

        return Inertia::render('PaymentMethods/Show', [
            'paymentMethod' => $paymentMethod
        ]);
    }

    public function edit(PaymentMethod $paymentMethod)
    {
        return Inertia::render('PaymentMethods/Edit', [
            'paymentMethod' => $paymentMethod
        ]);
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:payment_methods,code,' . $paymentMethod->id,
            'icon' => 'nullable|string|max:255',
            'requires_reference' => 'boolean',
            'fee_percentage' => 'nullable|numeric|min:0|max:100',
            'fee_amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0'
        ]);

        $data = $request->all();
        
        // Set boolean values
        $data['requires_reference'] = $request->boolean('requires_reference');
        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = $request->sort_order ?? $paymentMethod->sort_order;

        $paymentMethod->update($data);

        return redirect()->route('payment-methods.index')
            ->with('success', 'Payment method updated successfully.');
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        // Check if payment method has associated sales
        if ($paymentMethod->sales()->count() > 0) {
            return redirect()->route('payment-methods.index')
                ->with('error', 'Cannot delete payment method that has associated sales transactions.');
        }

        $paymentMethod->delete();

        return redirect()->route('payment-methods.index')
            ->with('success', 'Payment method deleted successfully.');
    }

    /**
     * Toggle active status of payment method
     */
    public function toggleStatus(PaymentMethod $paymentMethod)
    {
        $paymentMethod->update([
            'is_active' => !$paymentMethod->is_active
        ]);

        $status = $paymentMethod->is_active ? 'activated' : 'deactivated';

        return redirect()->route('payment-methods.index')
            ->with('success', "Payment method {$status} successfully.");
    }

    /**
     * Update sort order of payment methods
     */
    public function updateOrder(Request $request)
    {
        $request->validate([
            'payment_methods' => 'required|array',
            'payment_methods.*.id' => 'required|exists:payment_methods,id',
            'payment_methods.*.sort_order' => 'required|integer|min:0'
        ]);

        foreach ($request->payment_methods as $item) {
            PaymentMethod::where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return redirect()->route('payment-methods.index')
            ->with('success', 'Payment methods order updated successfully.');
    }

    /**
     * Get active payment methods for API/Ajax calls
     */
    public function getActive()
    {
        $paymentMethods = PaymentMethod::active()->get([
            'id', 'name', 'code', 'icon', 'requires_reference', 
            'fee_percentage', 'fee_amount'
        ]);

        return response()->json($paymentMethods);
    }

    /**
     * Calculate fee for a given amount and payment method
     */
    public function calculateFee(Request $request, PaymentMethod $paymentMethod)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0'
        ]);

        $fee = $paymentMethod->calculateFee($request->amount);
        
        return response()->json([
            'fee' => $fee,
            'total' => $request->amount + $fee,
            'fee_details' => [
                'percentage' => $paymentMethod->fee_percentage,
                'fixed_amount' => $paymentMethod->fee_amount,
                'calculated_fee' => $fee
            ]
        ]);
    }
}