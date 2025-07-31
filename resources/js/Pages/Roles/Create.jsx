// resources/js/Pages/Roles/Create.jsx
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Shield, Check } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ auth, permissions }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    permissions: []
  });

  const [selectAll, setSelectAll] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/roles');
  };

  const handlePermissionChange = (permissionId) => {
    const updatedPermissions = data.permissions.includes(permissionId)
      ? data.permissions.filter(id => id !== permissionId)
      : [...data.permissions, permissionId];
    
    setData('permissions', updatedPermissions);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setData('permissions', []);
    } else {
      setData('permissions', permissions.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  // Group permissions by category (assuming permission names follow pattern like 'user-create', 'user-read', etc.)
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const category = permission.name.split('-')[0] || 'general';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {});

  return (
    <AppLayout user={auth.user}>
      <Head title="Tambah Role Baru" />

      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/roles"
                className="text-gray-400 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Tambah Role Baru</h1>
                <p className="text-gray-600 mt-2">
                  Buat role baru dan tentukan izin akses yang sesuai.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Information */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">Informasi Role</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="role-name" className="block text-sm font-medium text-gray-900 mb-2">
                    Nama Role *
                  </label>
                  <input
                    id="role-name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                      errors.name 
                        ? 'ring-red-300 focus:ring-red-500' 
                        : 'ring-gray-300 focus:ring-gray-900'
                    }`}
                    placeholder="Contoh: Editor, Manager, Admin"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Izin Akses (Permissions)</h2>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {selectAll ? 'Unselect All' : 'Select All'}
                </button>
              </div>

              {errors.permissions && (
                <div className="mb-4 text-sm text-red-600">
                  {errors.permissions}
                </div>
              )}

              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 capitalize">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryPermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="relative flex items-center space-x-3 cursor-pointer group"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={data.permissions.includes(permission.id)}
                              onChange={() => handlePermissionChange(permission.id)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              data.permissions.includes(permission.id)
                                ? 'bg-gray-900 border-gray-900'
                                : 'border-gray-300 group-hover:border-gray-400'
                            }`}>
                              {data.permissions.includes(permission.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                            {permission.name.replace(/-/g, ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {data.permissions.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{data.permissions.length}</span> permissions selected
                  </p>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/roles"
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}