<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $customers = $query->latest()->paginate(10);

        return Inertia::render('Customers/Index', compact('customers'));
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:customers,email',
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
        ]);

        Customer::create([
            ...$request->all(),
            'is_active' => true,
            'total_spent' => 0,
            'visit_count' => 0,
        ]);

        return redirect()->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        $customer->load(['sales' => function($query) {
            $query->completed()->latest()->take(10);
        }]);

        return Inertia::render('Customers/Show', compact('customer'));
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Edit', compact('customer'));
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'is_active' => 'boolean',
        ]);

        $customer->update($request->all());

        return redirect()->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }

    // API Methods
    public function search(Request $request)
    {
        $customers = Customer::active()
            ->where('name', 'like', '%' . $request->q . '%')
            ->orWhere('phone', 'like', '%' . $request->q . '%')
            ->limit(10)
            ->get(['id', 'name', 'phone', 'customer_level']);

        return response()->json($customers);
    }
}