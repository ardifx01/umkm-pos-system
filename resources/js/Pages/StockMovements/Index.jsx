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
  Package,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Calendar,
  User,
  X
} from 'lucide-react';

export default function Index({ movements, types, filters, auth }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedType, setSelectedType] = useState(filters.type || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedType) params.type = selectedType;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;

    router.get(route('stock-movements.index'), params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setDateFrom('');
    setDateTo('');
    router.get(route('stock-movements.index'));
  };

  const deleteMovement = (movement) => {
    if (confirm(`Are you sure you want to delete this stock movement? This will reverse the stock changes.`)) {
      router.delete(route('stock-movements.destroy', movement.id));
    }
  };

  const getMovementIcon = (type) => {
    switch(type) {
      case 'in':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'out':
        return <TrendingDown size={16} className="text-red-600" />;
      case 'adjustment':
        return <RotateCcw size={16} className="text-blue-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getMovementBadge = (type) => {
    const badges = {
      'in': 'bg-green-100 text-green-800',
      'out': 'bg-red-100 text-red-800',
      'adjustment': 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      'in': 'Stock In',
      'out': 'Stock Out',
      'adjustment': 'Adjustment'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badges[type] || 'bg-gray-100 text-gray-800'}`}>
        {getMovementIcon(type)}
        <span className="ml-1">{labels[type] || type}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatQuantity = (quantity) => {
    const absQuantity = Math.abs(quantity);
    const sign = quantity >= 0 ? '+' : '-';
    return `${sign}${absQuantity}`;
  };

  const hasActiveFilters = searchTerm || selectedType || dateFrom || dateTo;

  // Check user permissions
  const canCreate = auth.user.roles.some(role => ['owner', 'manager'].includes(role.name));
  const canEdit = auth.user.roles.some(role => ['owner', 'manager'].includes(role.name));
  const canDelete = auth.user.roles.some(role => ['owner', 'manager'].includes(role.name));

  return (
    <AppLayout title="Stock Movements">
      <Head title="Stock Movements" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
              <p className="text-gray-500 mt-1">
                Track all inventory movements ({movements.total} records)
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
                  href={route('stock-movements.create')}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Add Movement
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by product name or SKU..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Movement Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">All Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type === 'in' ? 'Stock In' : type === 'out' ? 'Stock Out' : 'Adjustment'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
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

        {/* Stock Movements Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {movements.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Changes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movements.data.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package size={18} className="text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {movement.product?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                SKU: {movement.product?.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getMovementBadge(movement.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatQuantity(movement.quantity)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {movement.stock_before} → {movement.stock_after}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar size={14} className="mr-2 text-gray-400" />
                            {formatDate(movement.movement_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <User size={14} className="mr-2 text-gray-400" />
                            <div>
                              <div>{movement.user?.name}</div>
                              <div className="text-xs text-gray-500 capitalize">
                                {movement.user_role}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={route('stock-movements.show', movement.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="View"
                            >
                              <Eye size={16} />
                            </Link>
                            {canEdit && (
                              <Link
                                href={route('stock-movements.edit', movement.id)}
                                className="text-gray-400 hover:text-emerald-600 p-1"
                                title="Edit Notes"
                              >
                                <Edit size={16} />
                              </Link>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => deleteMovement(movement)}
                                className="text-gray-400 hover:text-red-600 p-1"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {movements.links && movements.links.length > 3 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      {movements.prev_page_url && (
                        <Link
                          href={movements.prev_page_url}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Previous
                        </Link>
                      )}
                      {movements.next_page_url && (
                        <Link
                          href={movements.next_page_url}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{movements.from}</span> to{' '}
                          <span className="font-medium">{movements.to}</span> of{' '}
                          <span className="font-medium">{movements.total}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {movements.links.map((link, index) => (
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
                                index === movements.links.length - 1 ? 'rounded-r-md' : ''
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
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stock movements found</h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms.'
                  : "No stock movements have been recorded yet."
                }
              </p>
              {!hasActiveFilters && canCreate && (
                <Link
                  href={route('stock-movements.create')}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Add Movement
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Notes Section for movements with notes */}
        {movements.data.some(movement => movement.notes) && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Recent Notes:</h4>
            <div className="space-y-2">
              {movements.data.filter(movement => movement.notes).slice(0, 3).map(movement => (
                <div key={movement.id} className="text-sm text-blue-800">
                  <span className="font-medium">{movement.product?.name}:</span> {movement.notes}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}