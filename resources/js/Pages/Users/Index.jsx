// resources/js/Pages/Users/Index.jsx
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, User, Eye } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ auth, users, roles, filters, flash }) {
  const [search, setSearch] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || '');

  // Handle search dan role filter dengan debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/users', 
        { 
          search: search || undefined,
          role: roleFilter || undefined
        }, 
        { 
          preserveState: true,
          replace: true 
        }
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, roleFilter]);

  const handleDelete = (user) => {
    if (confirm(`Apakah Anda yakin ingin menghapus user ${user.name}?`)) {
      router.delete(`/users/${user.id}`);
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
      <Head title="Manajemen Users" />

      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="border-b border-slate-200 pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
                <p className="text-slate-600 mt-2">
                  Daftar semua pengguna dalam sistem termasuk nama, email, dan peran mereka.
                </p>
              </div>
              <Link
                href="/users/create"
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md font-medium inline-flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add user
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

          {/* Filters Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm"
                />
              </div>
              
              {/* Role Filter */}
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-slate-300 rounded-md pl-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              >
                <option value="">All roles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-slate-700">
              <span className="font-medium">{users.total || users.data.length}</span> users
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-lg overflow-hidden">
            {users.data.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Tidak ada user ditemukan</h3>
                  <p className="text-slate-500">Coba ubah kata kunci pencarian atau tambah user baru</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Role
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
                  {users.data.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      {/* Name & Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Roles */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800"
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      
                      {/* Status - Assuming active for now */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/users/${user.id}`}
                            className="text-slate-400 hover:text-slate-900"
                            title="View User"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/users/${user.id}/edit`}
                            className="text-slate-400 hover:text-slate-900"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-slate-400 hover:text-red-600"
                            title="Delete User"
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