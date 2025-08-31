import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CreditCard,
  ToggleLeft,
  ToggleRight,
  Percent,
  DollarSign,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Index({ paymentMethods, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedStatus !== '') params.status = selectedStatus;

    router.get(route('payment-methods.index'), params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    router.get(route('payment-methods.index'));
  };

  const toggleStatus = (paymentMethod) => {
    router.patch(route('payment-methods.toggle-status', paymentMethod.id));
  };

  const deletePaymentMethod = (paymentMethod) => {
    if (confirm(`Are you sure you want to delete ${paymentMethod.name}?`)) {
      router.delete(route('payment-methods.destroy', paymentMethod.id));
    }
  };

  const formatFee = (paymentMethod) => {
    const parts = [];
    if (paymentMethod.fee_percentage > 0) {
      parts.push(`${paymentMethod.fee_percentage}%`);
    }
    if (paymentMethod.fee_amount > 0) {
      parts.push(`Rp ${paymentMethod.fee_amount.toLocaleString('id-ID')}`);
    }
    return parts.length > 0 ? parts.join(' + ') : 'No fee';
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPaymentMethods = React.useMemo(() => {
    if (!sortConfig.key) return paymentMethods.data;
    
    return [...paymentMethods.data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [paymentMethods.data, sortConfig]);

  const hasActiveFilters = searchTerm || selectedStatus !== '';

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown size={14} className="opacity-30" />;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-emerald-600" /> 
      : <ChevronDown size={14} className="text-emerald-600" />;
  };

  return (
    <AppLayout title="Payment Methods">
      <Head title="Payment Methods" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
              <p className="text-gray-500 mt-1">
                Manage your payment methods ({paymentMethods.total} methods)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                  hasActiveFilters 
                    ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100' 
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter size={16} className="mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
              <Link
                href={route('payment-methods.create')}
                className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                <Plus size={16} className="mr-2" />
                Add Method
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Methods
                  </label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or code..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">All Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Payment Methods Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {paymentMethods.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Method
                          <span className="ml-1">
                            <SortIcon columnKey="name" />
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('code')}
                      >
                        <div className="flex items-center">
                          Code
                          <span className="ml-1">
                            <SortIcon columnKey="code" />
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('is_active')}
                      >
                        <div className="flex items-center">
                          Status
                          <span className="ml-1">
                            <SortIcon columnKey="is_active" />
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPaymentMethods.map((method) => (
                      <tr key={method.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                {method.icon ? (
                                  <span className="text-emerald-600 font-semibold">{method.icon}</span>
                                ) : (
                                  <CreditCard size={20} className="text-emerald-600" />
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {method.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Order: {method.sort_order || 0}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {method.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            {method.fee_percentage > 0 && (
                              <Percent size={14} className="text-gray-400 mr-1" />
                            )}
                            {method.fee_amount > 0 && (
                              <DollarSign size={14} className="text-gray-400 mr-1" />
                            )}
                            {formatFee(method)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {method.requires_reference ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Optional
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleStatus(method)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              method.is_active 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            title={method.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                          >
                            {method.is_active ? (
                              <>
                                <ToggleRight size={14} className="mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={14} className="mr-1" />
                                Inactive
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={route('payment-methods.show', method.id)}
                              className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              href={route('payment-methods.edit', method.id)}
                              className="text-gray-400 hover:text-emerald-600 p-1 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => deletePaymentMethod(method)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {paymentMethods.links && paymentMethods.links.length > 3 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      {paymentMethods.prev_page_url && (
                        <Link
                          href={paymentMethods.prev_page_url}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Previous
                        </Link>
                      )}
                      {paymentMethods.next_page_url && (
                        <Link
                          href={paymentMethods.next_page_url}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{paymentMethods.from}</span> to{' '}
                          <span className="font-medium">{paymentMethods.to}</span> of{' '}
                          <span className="font-medium">{paymentMethods.total}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {paymentMethods.links.map((link, index) => (
                            <Link
                              key={index}
                              href={link.url || '#'}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                link.active
                                  ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                                  : link.url
                                  ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  : 'bg-gray-100 border-gray-300 text-gray-300 cursor-not-allowed'
                              } ${
                                index === 0 ? 'rounded-l-md' : ''
                              } ${
                                index === paymentMethods.links.length - 1 ? 'rounded-r-md' : ''
                              }`}
                              dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                <CreditCard size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms.'
                  : "Get started by adding your first payment method."
                }
              </p>
              {!hasActiveFilters && (
                <Link
                  href={route('payment-methods.create')}
                  className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  <Plus size={16} className="mr-2" />
                  Add Method
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}