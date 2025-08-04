import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, Tag, Eye, Package } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ auth, categories, flash }) {
  const [search, setSearch] = useState('');

  // Handle search dengan debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get(route('categories.index'), 
        { 
          search: search || undefined
        }, 
        { 
          preserveState: true,
          replace: true 
        }
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleDelete = (category) => {
    if (category.products_count > 0) {
      alert('Tidak dapat menghapus kategori yang masih memiliki produk.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus kategori ${category.name}?`)) {
      router.delete(route('categories.destroy', category.id), {
        onError: (errors) => {
          if (errors.error) {
            alert(errors.error);
          }
        }
      });
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

  const filteredCategories = categories.data.filter(category => 
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppLayout user={auth.user}>
      <Head title="Manajemen Categories" />

      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="border-b border-slate-200 pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
                <p className="text-slate-600 mt-2">
                  Daftar semua kategori produk dalam sistem termasuk nama, deskripsi, dan jumlah produk.
                </p>
              </div>
              <Link
                href={route('categories.create')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md font-medium inline-flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add category
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search categories by name or description"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm"
                />
              </div>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-slate-700">
              <span className="font-medium">{categories.total}</span> categories
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-lg overflow-hidden">
            {filteredCategories.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Tag className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Tidak ada kategori ditemukan</h3>
                  <p className="text-slate-500">Coba ubah kata kunci pencarian atau tambah kategori baru</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date created
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50">
                      {/* Category Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div 
                              className="h-10 w-10 rounded-full flex items-center justify-center"
                              style={{ 
                                backgroundColor: category.color || '#475569',
                                color: 'white'
                              }}
                            >
                              <Tag size={16} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{category.name}</div>
                            <div className="text-sm text-slate-500">ID: {category.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs">
                          {category.description ? (
                            <span className="line-clamp-2">{category.description}</span>
                          ) : (
                            <span className="text-slate-400 italic">No description</span>
                          )}
                        </div>
                      </td>
                      
                      {/* Products Count */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-slate-900">
                          <Package size={14} className="mr-1 text-slate-400" />
                          <span className="font-medium">{category.products_count}</span>
                          <span className="text-slate-500 ml-1">products</span>
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.is_active 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(category.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={route('categories.show', category.id)}
                            className="text-slate-400 hover:text-blue-600"
                            title="View Category"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={route('categories.edit', category.id)}
                            className="text-slate-400 hover:text-slate-900"
                            title="Edit Category"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(category)}
                            className={`text-slate-400 hover:text-red-600 ${
                              category.products_count > 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={category.products_count > 0 ? 'Cannot delete category with products' : 'Delete Category'}
                            disabled={category.products_count > 0}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            {categories.data.length > 0 && (
              <div className="px-6 pb-4">
                <Pagination links={categories.links} meta={categories} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}