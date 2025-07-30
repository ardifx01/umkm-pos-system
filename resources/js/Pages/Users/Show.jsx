// resources/js/Pages/Users/Show.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Calendar, Shield, Edit } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ auth, user }) {
  return (
    <AppLayout user={auth.user}>
      <Head title={`Detail User - ${user.name}`} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/users"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Kembali ke Daftar Users
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href={`/users/${user.id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Edit size={16} className="mr-2" />
                  Edit User
                </Link>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header Profile */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-emerald-100 mt-1">{user.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm"
                      >
                        <Shield size={14} className="mr-1" />
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Informasi Dasar
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                          <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <a
                              href={`mailto:${user.email}`}
                              className="text-emerald-600 hover:text-emerald-500"
                            >
                              {user.email}
                            </a>
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Tanggal Bergabung</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(user.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </dd>
                        </div>
                      </div>

                      {user.updated_at && (
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <Calendar className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Terakhir Diperbarui</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(user.updated_at).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </dd>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Roles & Permissions */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Role & Hak Akses
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">Role yang Dimiliki</dt>
                        <dd className="space-y-2">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <div
                                key={role.id}
                                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                              >
                                <Shield size={16} className="mr-2" />
                                <span className="font-semibold">{role.name}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 italic">
                              Tidak ada role yang diberikan
                            </span>
                          )}
                        </dd>
                      </div>

                      {/* Status Badge */}
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">Status Akun</dt>
                        <dd>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                            Aktif
                          </span>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  ID User: <span className="font-mono font-medium">{user.id}</span>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href="/users"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Kembali
                  </Link>
                  <Link
                    href={`/users/${user.id}/edit`}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit User
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}