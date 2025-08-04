import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, Shield, Eye, Users } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ auth, roles, flash }) {
  const [search, setSearch] = useState('');

  // Handle search dengan debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get(route('roles.index'), 
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

  const handleDelete = (role) => {
    if (confirm(`Apakah Anda yakin ingin menghapus role ${role.name}?`)) {
      router.delete(route('roles.destroy', role.id), {
        onError: (errors) => {
          if (errors.error) {
            alert(errors.error);
          }
        }
      });
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout user={auth.user}>
      <Head title="Manajemen Roles" />

      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
                <p className="text-gray-600 mt-2">
                  Kelola role pengguna dan izin akses dalam sistem.
                </p>
              </div>
              <Link
                href={route('roles.create')}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium inline-flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add role
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search roles"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                />
              </div>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-gray-700">
              <span className="font-medium">{filteredRoles.length}</span> roles
            </div>
          </div>

          {/* Roles Table */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
            {filteredRoles.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada role ditemukan</h3>
                  <p className="text-gray-500">Coba ubah kata kunci pencarian atau tambah role baru</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      {/* Role Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 capitalize">{role.name}</div>
                            <div className="text-sm text-gray-500">Role ID: {role.id}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Users Count */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 font-medium">
                            {role.users_count || 0}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">users</span>
                        </div>
                      </td>
                      
                      {/* Created At */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(role.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={route('roles.show', role.id)}
                            className="text-gray-400 hover:text-blue-600"
                            title="View Role"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={route('roles.edit', role.id)}
                            className="text-gray-400 hover:text-gray-900"
                            title="Edit Role"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(role)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete Role"
                            disabled={role.users_count > 0}
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}