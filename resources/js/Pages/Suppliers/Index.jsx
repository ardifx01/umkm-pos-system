// resources/js/Pages/Suppliers/Index.jsx
import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

export default function Index({ suppliers, filters = {} }) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [actionDropdown, setActionDropdown] = useState(null);

  const { data, setData, get, processing } = useForm({
    search: filters.search || '',
    active_only: filters.active_only || false,
    per_page: filters.per_page || 15
  });

  const handleSearch = (e) => {
    e.preventDefault();
    get(route('suppliers.index'), {
      preserveState: true,
      replace: true
    });
  };

  const handleFilter = (key, value) => {
    setData(key, value);
    get(route('suppliers.index'), {
      data: { ...data, [key]: value },
      preserveState: true,
      replace: true
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSuppliers(suppliers.data.map(supplier => supplier.id));
    } else {
      setSelectedSuppliers([]);
    }
  };

  const handleSelectSupplier = (supplierId) => {
    if (selectedSuppliers.includes(supplierId)) {
      setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
    } else {
      setSelectedSuppliers([...selectedSuppliers, supplierId]);
    }
  };

  const toggleSupplierStatus = (supplier) => {
    router.patch(route('suppliers.toggle-status', supplier.id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        // You could add a toast notification here
      }
    });
  };

  const deleteSupplier = (supplier) => {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      router.delete(route('suppliers.destroy', supplier.id), {
        preserveScroll: true
      });
    }
  };

  const ActionDropdown = ({ supplier }) => (
    <div className="relative">
      <button
        onClick={() => setActionDropdown(actionDropdown === supplier.id ? null : supplier.id)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical size={16} className="text-gray-500" />
      </button>
      
      {actionDropdown === supplier.id && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <Link
              href={route('suppliers.show', supplier.id)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={14} />
              View Details
            </Link>
            <Link
              href={route('suppliers.edit', supplier.id)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit2 size={14} />
              Edit Supplier
            </Link>
            <button
              onClick={() => toggleSupplierStatus(supplier)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {supplier.is_active ? <XCircle size={14} /> : <CheckCircle size={14} />}
              {supplier.is_active ? 'Deactivate' : 'Activate'}
            </button>
            <hr className="my-1" />
            <button
              onClick={() => deleteSupplier(supplier)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete Supplier
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppLayout>
      <Head title="Suppliers" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
                <p className="mt-2 text-gray-600">Manage your supplier relationships and contacts</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={16} />
                  Export
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload size={16} />
                  Import
                </button>
                <Link
                  href={route('suppliers.create')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Supplier
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Suppliers</p>
                  <p className="text-2xl font-bold text-gray-900">{suppliers.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Suppliers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {suppliers.data.filter(s => s.is_active).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inactive Suppliers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {suppliers.data.filter(s => !s.is_active).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recent Orders</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search suppliers by name, contact person, or email..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={data.search}
                      onChange={(e) => setData('search', e.target.value)}
                    />
                  </div>
                </form>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
                    showFilters ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter size={16} />
                  Filters
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={data.active_only ? 'active' : 'all'}
                        onChange={(e) => handleFilter('active_only', e.target.value === 'active')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="all">All Suppliers</option>
                        <option value="active">Active Only</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Per Page</label>
                      <select
                        value={data.per_page}
                        onChange={(e) => handleFilter('per_page', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="10">10 per page</option>
                        <option value="15">15 per page</option>
                        <option value="25">25 per page</option>
                        <option value="50">50 per page</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suppliers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              {/* Bulk Actions */}
              {selectedSuppliers.length > 0 && (
                <div className="flex items-center justify-between p-4 mb-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-sm text-emerald-700">
                    {selectedSuppliers.length} supplier(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm bg-white border border-emerald-300 text-emerald-700 rounded hover:bg-emerald-50">
                      Bulk Export
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                      Bulk Delete
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          checked={selectedSuppliers.length === suppliers.data.length}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Supplier</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Contact Info</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Address</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Last Order</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.data.map((supplier) => (
                      <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            checked={selectedSuppliers.includes(supplier.id)}
                            onChange={() => handleSelectSupplier(supplier.id)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{supplier.name}</div>
                            <div className="text-sm text-gray-500">
                              {supplier.contact_person && `Contact: ${supplier.contact_person}`}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {supplier.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={14} />
                                {supplier.phone}
                              </div>
                            )}
                            {supplier.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} />
                                {supplier.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {supplier.address ? (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{supplier.address}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No address</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            supplier.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {supplier.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {supplier.last_order_date || 'No orders yet'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <ActionDropdown supplier={supplier} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {suppliers.data.length === 0 && (
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first supplier.
                  </p>
                  <div className="mt-6">
                    <Link
                      href={route('suppliers.create')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Add Supplier
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {suppliers.data.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {suppliers.from} to {suppliers.to} of {suppliers.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    {suppliers.links.map((link, index) => (
                      link.url ? (
                        <Link
                          key={index}
                          href={link.url}
                          className={`px-3 py-2 text-sm rounded-lg ${
                            link.active 
                              ? 'bg-emerald-600 text-white' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      ) : (
                        <span
                          key={index}
                          className="px-3 py-2 text-sm text-gray-400"
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}