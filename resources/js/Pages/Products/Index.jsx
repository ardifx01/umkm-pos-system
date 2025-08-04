import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, Package, Eye, Filter, AlertTriangle, Tag } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ auth, products, categories, flash }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Handle search dan filter dengan debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get(route('products.index'), 
        { 
          search: search || undefined,
          category_id: categoryFilter || undefined,
          low_stock: lowStockFilter ? '1' : undefined
        }, 
        { 
          preserveState: true,
          replace: true 
        }
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, categoryFilter, lowStockFilter]);

  const handleDelete = (product) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk ${product.name}?`)) {
      router.delete(route('products.destroy', product.id), {
        onError: (errors) => {
          if (errors.error) {
            alert(errors.error);
          }
        }
      });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setLowStockFilter(false);
  };

  // Helper function untuk format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Helper function untuk status stok
  const getStockStatus = (product) => {
    if (product.stock <= 0) {
      return { status: 'out', label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (product.min_stock && product.stock <= product.min_stock) {
      return { status: 'low', label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'good', label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  // Component untuk pagination
  const Pagination = ({ links, meta }) => {
    if (!links || links.length <= 3) return null;

    return (
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
        {/* Results info */}
        <div className="text-sm text-slate-600">
          Menampilkan <span className="font-medium text-slate-900">{meta.from}</span> sampai{' '}
          <span className="font-medium text-slate-900">{meta.to}</span> dari{' '}
          <span className="font-medium text-slate-900">{meta.total}</span> hasil
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          {links.map((link, index) => {
            if (index === 0) {
              // Previous button
              return (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    link.url
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                  preserveState
                >
                  Sebelumnya
                </Link>
              );
            } else if (index === links.length - 1) {
              // Next button
              return (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    link.url
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                  preserveState
                >
                  Selanjutnya
                </Link>
              );
            } else {
              // Page numbers
              return (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    link.active
                      ? 'bg-slate-900 text-white'
                      : link.url
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                  preserveState
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <AppLayout user={auth.user}>
      <Head title="Manajemen Products" />

      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="border-b border-slate-200 pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
                <p className="text-slate-600 mt-2">
                  Daftar semua produk dalam sistem termasuk stok, harga, dan informasi kategori.
                </p>
              </div>
              <Link
                href={route('products.create')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md font-medium inline-flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add product
              </Link>
            </div>
          </div>

          {/* Flash Messages */}
          {flash?.success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{flash.success}</span>
              </div>
            </div>
          )}

          {flash?.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{flash.error}</span>
              </div>
            </div>
          )}

          {/* Filters Section */}
          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products by name or SKU"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>

              {/* Low Stock Filter */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={lowStockFilter}
                  onChange={(e) => setLowStockFilter(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="ml-2 text-sm text-slate-700">Low Stock Only</span>
              </label>

              {/* Clear Filters */}
              {(search || categoryFilter || lowStockFilter) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-600 hover:text-slate-900 underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-3 text-sm text-slate-700">
              <span className="font-medium">{products.total}</span> products found
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-lg overflow-hidden">
            {products.data.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Tidak ada produk ditemukan</h3>
                  <p className="text-slate-500">Coba ubah filter pencarian atau tambah produk baru</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date added
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {products.data.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id} className="hover:bg-slate-50">
                        {/* Product Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Package size={16} className="text-slate-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{product.name}</div>
                              <div className="text-sm text-slate-500">SKU: {product.sku}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.category ? (
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: product.category.color || '#475569' }}
                              ></div>
                              <span className="text-sm text-slate-900">{product.category.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">No Category</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {stockStatus.status === 'low' && (
                              <AlertTriangle size={14} className="text-yellow-500 mr-1" />
                            )}
                            {stockStatus.status === 'out' && (
                              <AlertTriangle size={14} className="text-red-500 mr-1" />
                            )}
                            <span className="text-sm font-medium text-slate-900">{product.stock}</span>
                            <span className="text-sm text-slate-500 ml-1">{product.unit}</span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            <div className="font-medium">{formatCurrency(product.selling_price)}</div>
                            <div className="text-slate-500 text-xs">Cost: {formatCurrency(product.purchase_price)}</div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                            {!product.is_active && (
                              <div>
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Inactive
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(product.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={route('products.show', product.id)}
                              className="text-slate-400 hover:text-blue-600"
                              title="View Product"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              href={route('products.edit', product.id)}
                              className="text-slate-400 hover:text-slate-900"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product)}
                              className="text-slate-400 hover:text-red-600"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            {products.data.length > 0 && (
              <div className="px-6 pb-4">
                <Pagination links={products.links} meta={products} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}