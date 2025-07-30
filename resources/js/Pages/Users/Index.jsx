// resources/js/Pages/Users/Index.jsx
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, User, Eye } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ auth, users, filters, flash }) {
  const [search, setSearch] = useState(filters.search || '');

  // Handle search dengan debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/users', 
        { search: search || undefined }, 
        { 
          preserveState: true,
          replace: true 
        }
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleDelete = (user) => {
    if (confirm(`Apakah Anda yakin ingin menghapus user ${user.name}?`)) {
      router.delete(`/users/${user.id}`);
    }
  };

  // Component untuk pagination
  const Pagination = ({ links, meta }) => {
    if (!links || links.length <= 3) return null;

    return (
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        {/* Results info */}
        <div className="text-sm text-gray-600">
          Menampilkan <span className="font-medium text-gray-900">{meta.from}</span> sampai{' '}
          <span className="font-medium text-gray-900">{meta.to}</span> dari{' '}
          <span className="font-medium text-gray-900">{meta.total}</span> hasil
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
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      : 'text-gray-400 cursor-not-allowed'
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
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      : 'text-gray-400 cursor-not-allowed'
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
                      ? 'bg-emerald-600 text-white'
                      : link.url
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      : 'text-gray-400 cursor-not-allowed'
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
      <Head title="Manajemen Users" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                <p className="mt-1 text-sm text-gray-600">Kelola pengguna sistem</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href="/users/create"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Plus size={16} className="mr-2" />
                  Tambah User
                </Link>
              </div>
            </div>
          </div>

          {/* Flash Messages */}
          {flash?.success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{flash.success}</span>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-gray-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {users.data.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada user ditemukan</h3>
                  <p className="text-gray-500">Coba ubah kata kunci pencarian atau tambah user baru</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {users.data.map((user) => (
                  <div key={user.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      {/* User Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </h3>
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role) => (
                                <span
                                  key={role.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {role.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>

                        {/* Created Date */}
                        <div className="hidden md:block text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/users/${user.id}`} 
                          className='text-gray-400 hover:text-emerald-600 p-1'
                          title='Lihat User'
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/users/${user.id}/edit`}
                          className="text-gray-400 hover:text-emerald-600 p-1"
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Hapus User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {users.data.length > 0 && (
              <div className="px-6 pb-4">
                <Pagination links={users.links} meta={users.meta || users} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}