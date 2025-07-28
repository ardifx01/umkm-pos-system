// resources/js/Pages/Roles/Edit.jsx
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ auth, role, permissions }) {
  const { data, setData, put, processing, errors } = useForm({
    name: role.name || '',
    permissions: role.permissions.map(p => p.id) || [],
  });

  const [searchPermission, setSearchPermission] = useState('');

  // Filter permissions berdasarkan search
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchPermission.toLowerCase())
  );

  // Group permissions by prefix (assuming permissions follow pattern like 'users.create', 'posts.edit', etc.)
  const groupedPermissions = filteredPermissions.reduce((groups, permission) => {
    const prefix = permission.name.split('.')[0] || 'other';
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(permission);
    return groups;
  }, {});

  const handlePermissionToggle = (permissionId) => {
    const updatedPermissions = data.permissions.includes(permissionId)
      ? data.permissions.filter(id => id !== permissionId)
      : [...data.permissions, permissionId];
    
    setData('permissions', updatedPermissions);
  };

  const handleGroupToggle = (groupPermissions) => {
    const groupIds = groupPermissions.map(p => p.id);
    const allSelected = groupIds.every(id => data.permissions.includes(id));
    
    if (allSelected) {
      // Unselect all in group
      setData('permissions', data.permissions.filter(id => !groupIds.includes(id)));
    } else {
      // Select all in group
      const newPermissions = [...new Set([...data.permissions, ...groupIds])];
      setData('permissions', newPermissions);
    }
  };

  const handleSelectAll = () => {
    if (data.permissions.length === filteredPermissions.length) {
      setData('permissions', []);
    } else {
      setData('permissions', filteredPermissions.map(p => p.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/roles/${role.id}`);
  };

  return (
    <AppLayout user={auth.user}>
      <Head title={`Edit Role - ${role.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/roles"
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Role</h1>
              <p className="text-gray-600 mt-1">Ubah role dan permissions untuk: <span className="font-medium capitalize">{role.name}</span></p>
            </div>
          </div>
          
          {/* Role Info Badge */}
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-blue-700">
              ID: {role.id}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Name */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Role</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Role
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama role (contoh: Admin, Editor, User)"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Permissions</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{data.permissions.length}</span> dari{' '}
                  <span className="font-medium">{filteredPermissions.length}</span> dipilih
                </div>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {data.permissions.length === filteredPermissions.length ? 'Batalkan Semua' : 'Pilih Semua'}
                </button>
              </div>
            </div>

            {/* Changes Indicator */}
            {(() => {
              const originalPermissionIds = role.permissions.map(p => p.id).sort();
              const currentPermissionIds = [...data.permissions].sort();
              const hasChanges = JSON.stringify(originalPermissionIds) !== JSON.stringify(currentPermissionIds);
              
              if (hasChanges) {
                const added = data.permissions.filter(id => !originalPermissionIds.includes(id));
                const removed = originalPermissionIds.filter(id => !data.permissions.includes(id));
                
                return (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-sm font-medium text-yellow-800">Perubahan Terdeteksi</span>
                    </div>
                    <div className="text-sm text-yellow-700">
                      {added.length > 0 && (
                        <div>+ {added.length} permission ditambahkan</div>
                      )}
                      {removed.length > 0 && (
                        <div>- {removed.length} permission dihapus</div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Search Permissions */}
            <div className="mb-6">
              <div className="relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari permissions..."
                  value={searchPermission}
                  onChange={(e) => setSearchPermission(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Grouped Permissions */}
            {Object.keys(groupedPermissions).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>Tidak ada permissions yang ditemukan</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([group, groupPermissions]) => {
                  const allSelected = groupPermissions.every(p => data.permissions.includes(p.id));
                  const someSelected = groupPermissions.some(p => data.permissions.includes(p.id));
                  
                  return (
                    <div key={group} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleGroupToggle(groupPermissions)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              allSelected
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : someSelected
                                ? 'bg-blue-100 border-blue-600'
                                : 'border-gray-300'
                            }`}
                          >
                            {allSelected && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {someSelected && !allSelected && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </button>
                          <h3 className="text-lg font-medium text-gray-900 capitalize">
                            {group}
                          </h3>
                          <span className="text-sm text-gray-500">
                            ({groupPermissions.filter(p => data.permissions.includes(p.id)).length}/{groupPermissions.length})
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-8">
                        {groupPermissions.map((permission) => {
                          const isCurrentlySelected = data.permissions.includes(permission.id);
                          const wasOriginallySelected = role.permissions.some(p => p.id === permission.id);
                          const isChanged = isCurrentlySelected !== wasOriginallySelected;
                          
                          return (
                            <label
                              key={permission.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                                isChanged
                                  ? isCurrentlySelected
                                    ? 'border-green-300 bg-green-50 hover:bg-green-100'
                                    : 'border-red-300 bg-red-50 hover:bg-red-100'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isCurrentlySelected}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {permission.name}
                                  </span>
                                  {isChanged && (
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      isCurrentlySelected
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      {isCurrentlySelected ? 'Ditambah' : 'Dihapus'}
                                    </span>
                                  )}
                                </div>
                                {permission.description && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {permission.description}
                                  </div>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {errors.permissions && (
              <p className="mt-4 text-sm text-red-600">{errors.permissions}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
            <Link
              href="/roles"
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {processing && (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {processing ? 'Menyimpan...' : 'Update Role'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}