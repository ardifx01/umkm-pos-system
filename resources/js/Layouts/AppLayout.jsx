// resources/js/Layouts/AppLayout.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';

export default function AppLayout({ children, user }) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />

      <main className="flex-1 bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Selamat Datang</h1>
            <Link 
              href="/logout" 
              method="post" 
              as="button" 
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
          </div>
        </header>

        <div className="px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
