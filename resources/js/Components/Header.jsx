// resources/js/Components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Search, 
  Menu, 
  Plus, 
  ShoppingCart, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Receipt,
  CreditCard,
  X
} from 'lucide-react';

export default function Header({ title = "Dashboard", onToggleSidebar }) {
  const { auth } = usePage().props;
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAddSalesDropdown, setShowAddSalesDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const profileDropdownRef = useRef(null);
  const addSalesDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (addSalesDropdownRef.current && !addSalesDropdownRef.current.contains(event.target)) {
        setShowAddSalesDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSalesOptions = [
    {
      icon: ShoppingCart,
      label: 'Transaksi Baru',
      description: 'Buat transaksi penjualan baru',
      href: '/sales/create',
      color: 'text-emerald-600',
      shortcut: 'Ctrl+N'
    },
    {
      icon: Receipt,
      label: 'Quick Sale',
      description: 'Penjualan cepat tanpa customer',
      href: '/sales/quick',
      color: 'text-blue-600',
      shortcut: 'Ctrl+Q'
    },
    {
      icon: CreditCard,
      label: 'Pembayaran Pending',
      description: 'Lanjutkan pembayaran tertunda',
      href: '/sales/pending',
      color: 'text-orange-600',
      shortcut: 'Ctrl+P'
    }
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Mobile menu button */}
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <Menu size={22} />
              </button>
              
              {/* Title Section */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{title}</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">
                  Selamat datang, {(auth?.user?.name || 'Admin').split(' ')[0]}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search - Desktop */}
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="pl-10 pr-4 py-2.5 w-56 xl:w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Search Button - Mobile/Tablet */}
              <button
                onClick={() => setShowMobileSearch(true)}
                className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <Search size={20} />
              </button>

              {/* Add Sales Dropdown */}
              <div className="relative" ref={addSalesDropdownRef}>
                <button
                  onClick={() => {
                    setShowAddSalesDropdown(!showAddSalesDropdown);
                    setShowProfileDropdown(false);
                  }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium text-sm touch-manipulation active:scale-95"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Penjualan</span>
                  <span className="sm:hidden">POS</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showAddSalesDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Add Sales Dropdown Menu */}
                {showAddSalesDropdown && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-1">
                      <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 rounded-t-xl">
                        Menu Penjualan
                      </div>
                      {addSalesOptions.map((option, index) => {
                        const IconComponent = option.icon;
                        return (
                          <Link
                            key={option.href}
                            href={option.href}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-all duration-200 group rounded-xl mx-1 touch-manipulation active:bg-gray-100"
                            onClick={() => setShowAddSalesDropdown(false)}
                          >
                            <div className={`p-3 rounded-xl bg-gray-100 group-hover:bg-white ${option.color} transition-all duration-200 group-hover:shadow-md`}>
                              <IconComponent size={20} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                                  {option.label}
                                </h4>
                                <span className="text-xs text-gray-400 font-mono hidden sm:block">
                                  {option.shortcut}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {option.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowAddSalesDropdown(false);
                  }}
                  className="flex items-center gap-2 sm:gap-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group touch-manipulation active:bg-gray-200"
                >
                  {/* User info - Hidden on mobile */}
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate max-w-32">
                      {auth?.user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {auth?.user?.role || 'Administrator'}
                    </p>
                  </div>
                  
                  {/* Avatar */}
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                    <User size={18} className="text-white" strokeWidth={2} />
                  </div>
                  
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''} hidden sm:block`} />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-1">
                      {/* User Info Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl mx-1 mb-1">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <User size={20} className="text-white" strokeWidth={2} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {auth?.user?.name || 'Admin User'}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {auth?.user?.email || 'admin@umkmpos.com'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-xl mx-1 touch-manipulation"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <User size={18} />
                          <span>Profile Saya</span>
                        </Link>
                        
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-xl mx-1 touch-manipulation"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <Settings size={18} />
                          <span>Pengaturan</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2 mx-3"></div>
                        
                        <Link
                          href="/logout"
                          method="post"
                          as="button"
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 rounded-xl mx-1 touch-manipulation"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari produk, transaksi..."
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors touch-manipulation"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}