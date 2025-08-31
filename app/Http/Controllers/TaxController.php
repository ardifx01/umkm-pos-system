<?php

namespace App\Http\Controllers;

use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class TaxController extends Controller
{
    /**
     * Display a listing of taxes.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tax::query();

        // Filter by active status if requested
        if ($request->has('active_only') && $request->active_only) {
            $query->active();
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('code', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $taxes = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $taxes
        ]);
    }

    /**
     * Show the form for creating a new tax.
     * Returns empty tax structure with default values.
     */
    public function create(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Ready to create new tax',
            'data' => [
                'name' => '',
                'code' => '',
                'rate' => 0.00,
                'is_inclusive' => false,
                'is_active' => true,
                'description' => ''
            ]
        ]);
    }

    /**
     * Store a newly created tax.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:taxes,code',
                'rate' => 'required|numeric|min:0|max:100',
                'is_inclusive' => 'boolean',
                'is_active' => 'boolean',
                'description' => 'nullable|string'
            ]);

            // Set default values if not provided
            $validated['is_inclusive'] = $validated['is_inclusive'] ?? false;
            $validated['is_active'] = $validated['is_active'] ?? true;

            $tax = Tax::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Tax created successfully',
                'data' => $tax
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified tax.
     */
    public function show(Tax $tax): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $tax->load(['products', 'sales'])
        ]);
    }

    public function edit(Tax $tax): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Tax edit form data',
            'data' => $tax
        ]);
    }

    /**
     * Update the specified tax.
     */
    public function update(Request $request, Tax $tax): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:50|unique:taxes,code,' . $tax->id,
                'rate' => 'sometimes|required|numeric|min:0|max:100',
                'is_inclusive' => 'boolean',
                'is_active' => 'boolean',
                'description' => 'nullable|string'
            ]);

            $tax->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Tax updated successfully',
                'data' => $tax
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Remove the specified tax from storage (soft delete).
     */
    public function destroy(Tax $tax): JsonResponse
    {
        $tax->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tax deleted successfully'
        ]);
    }

    /**
     * Restore a soft deleted tax.
     */
    public function restore($id): JsonResponse
    {
        $tax = Tax::withTrashed()->findOrFail($id);
        $tax->restore();

        return response()->json([
            'success' => true,
            'message' => 'Tax restored successfully',
            'data' => $tax
        ]);
    }

    /**
     * Toggle tax active status.
     */
    public function toggleStatus(Tax $tax): JsonResponse
    {
        $tax->update(['is_active' => !$tax->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Tax status updated successfully',
            'data' => $tax
        ]);
    }

    /**
     * Calculate tax for given amount.
     */
    public function calculateTax(Request $request, Tax $tax): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0'
        ]);

        $amount = $validated['amount'];
        $taxAmount = $tax->calculateTax($amount);
        $totalAmount = $tax->calculateAmountWithTax($amount);

        return response()->json([
            'success' => true,
            'data' => [
                'tax' => $tax,
                'base_amount' => $amount,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'tax_rate' => $tax->formatted_rate
            ]
        ]);
    }

    /**
     * Get all active taxes for dropdown/select options.
     */
    public function getActiveTaxes(): JsonResponse
    {
        $taxes = Tax::active()
            ->select('id', 'name', 'code', 'rate', 'is_inclusive')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $taxes
        ]);
    }
}