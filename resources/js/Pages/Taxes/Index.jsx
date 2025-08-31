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
  Calculator,
  ToggleLeft,
  ToggleRight,
  Percent,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertTriangle,
  X
} from 'lucide-react';

export default function Index({ taxes, filters, auth }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;

    router.get(route('taxes.index'), params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    router.get(route('taxes.index'));
  };

  const deleteTax = (tax) => {
    if (confirm(`Are you sure you want to delete "${tax.name}" tax? This action cannot be undone.`)) {
      router.delete(route('taxes.destroy', tax.id));
    }
  };

  const toggleStatus = (tax) => {
    router.post(route('taxes.toggle-status', tax.id), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const restoreTax = (tax) => {
    if (confirm(`Are you sure you want to restore "${tax.name}" tax?`)) {
      router.post(route('taxes.restore', tax.id));
    }
  };

  const getStatusBadge = (isActive, isDeleted) => {
    if (isDeleted) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          <XCircle size={12} className="mr-1" />
          Deleted
        </span>
      );
    }
    
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Active
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        <XCircle size={12} className="mr-1" />
        Inactive
      </span>
    );
  };

  const getTypeBadge = (isInclusive) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
        isInclusive 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-purple-100 text-purple-800'
      }`}>
        {isInclusive ? 'Inclusive' : 'Exclusive'}
      </span>
    );
  };

  const formatRate = (rate) => {
    return `${parseFloat(rate).toFixed(2)}%`;
  };

  const hasActiveFilters = searchTerm || statusFilter;

  // Check user permissions
  const canCreate = auth.user.roles.some(role => ['owner', 'manager'].includes(role.name));
  const canEdit = auth.user.roles.some(role => ['owner', 'manager'].includes(role.name));
  const canDelete = auth.user.roles.some(role => ['owner'].includes(role.name));
  const canRestore = auth.user.roles.some(role => ['owner'].includes(role.name));

  return (
    <AppLayout title="Tax Management">
      <Head title="Tax Management" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tax Management</h1>
              <p className="text-gray-500 mt-1">
                Manage tax rates and configurations ({taxes.total} records)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  hasActiveFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'text-gray-700 bg-white hover:bg-gray-50'
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
              {canCreate && (
                <Link
                  href={route('taxes.create')}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Add Tax
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Taxes
                  </label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, code, or description..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="deleted">Deleted Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Taxes Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {taxes.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taxes.data.map((tax) => (
                      <tr key={tax.id} className={`hover:bg-gray-50 ${tax.deleted_at ? 'bg-gray-50 opacity-75' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                tax.deleted_at 
                                  ? 'bg-gray-200' 
                                  : tax.is_active 
                                    ? 'bg-emerald-100' 
                                    : 'bg-gray-200'
                              }`}>
                                <Percent size={18} className={`${
                                  tax.deleted_at 
                                    ? 'text-gray-400' 
                                    : tax.is_active 
                                      ? 'text-emerald-600' 
                                      : 'text-gray-400'
                                }`} />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${tax.deleted_at ? 'text-gray-500' : 'text-gray-900'}`}>
                                {tax.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Code: {tax.code}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calculator size={14} className="mr-2 text-gray-400" />
                            <span className={`text-sm font-medium ${
                              tax.deleted_at ? 'text-gray-500' : 'text-gray-900'
                            }`}>
                              {formatRate(tax.rate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTypeBadge(tax.is_inclusive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(tax.is_active, tax.deleted_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm ${tax.deleted_at ? 'text-gray-500' : 'text-gray-900'} max-w-xs truncate`}>
                            {tax.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {!tax.deleted_at ? (
                              <>
                                <Link
                                  href={route('taxes.show', tax.id)}
                                  className="text-gray-400 hover:text-gray-600 p-1"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </Link>
                                {canEdit && (
                                  <>
                                    <Link
                                      href={route('taxes.edit', tax.id)}
                                      className="text-gray-400 hover:text-emerald-600 p-1"
                                      title="Edit Tax"
                                    >
                                      <Edit size={16} />
                                    </Link>
                                    <button
                                      onClick={() => toggleStatus(tax)}
                                      className={`p-1 ${
                                        tax.is_active 
                                          ? 'text-green-600 hover:text-green-800' 
                                          : 'text-gray-400 hover:text-green-600'
                                      }`}
                                      title={tax.is_active ? 'Deactivate' : 'Activate'}
                                    >
                                      {tax.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                    </button>
                                  </>
                                )}
                                {canDelete && (
                                  <button
                                    onClick={() => deleteTax(tax)}
                                    className="text-gray-400 hover:text-red-600 p-1"
                                    title="Delete Tax"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </>
                            ) : (
                              <>
                                <Link
                                  href={route('taxes.show', tax.id)}
                                  className="text-gray-400 hover:text-gray-600 p-1"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </Link>
                                {canRestore && (
                                  <button
                                    onClick={() => restoreTax(tax)}
                                    className="text-gray-400 hover:text-blue-600 p-1"
                                    title="Restore Tax"
                                  >
                                    <RotateCcw size={16} />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {taxes.links && taxes.links.length > 3 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      {taxes.prev_page_url && (
                        <Link
                          href={taxes.prev_page_url}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Previous
                        </Link>
                      )}
                      {taxes.next_page_url && (
                        <Link
                          href={taxes.next_page_url}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{taxes.from}</span> to{' '}
                          <span className="font-medium">{taxes.to}</span> of{' '}
                          <span className="font-medium">{taxes.total}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {taxes.links.map((link, index) => (
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
                                index === taxes.links.length - 1 ? 'rounded-r-md' : ''
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
            <div className="text-center py-12">
              <Percent size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No taxes found</h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms.'
                  : "No tax configurations have been created yet."
                }
              </p>
              {!hasActiveFilters && canCreate && (
                <Link
                  href={route('taxes.create')}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Add Tax
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Tax Summary Cards */}
        {taxes.data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-900">Active Taxes</p>
                  <p className="text-lg font-bold text-green-700">
                    {taxes.data.filter(tax => tax.is_active && !tax.deleted_at).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle size={20} className="text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-900">Inactive Taxes</p>
                  <p className="text-lg font-bold text-red-700">
                    {taxes.data.filter(tax => !tax.is_active && !tax.deleted_at).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Calculator size={20} className="text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Avg Tax Rate</p>
                  <p className="text-lg font-bold text-blue-700">
                    {taxes.data.length > 0 
                      ? `${(taxes.data.reduce((sum, tax) => sum + parseFloat(tax.rate), 0) / taxes.data.length).toFixed(2)}%`
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning for deleted taxes */}
        {taxes.data.some(tax => tax.deleted_at) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle size={20} className="text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900">
                  Deleted taxes are shown for reference
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Deleted taxes cannot be used in new transactions but are kept for historical data.
                  {canRestore && ' You can restore them if needed.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}