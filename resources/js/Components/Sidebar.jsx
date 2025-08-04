// resources/js/Components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Shield, 
  Settings,
  ChevronDown,
  LogOut,
  User,
  ListFilterIcon,
  UserCheck,
  Truck,
  ShoppingBag,
  Package2
} from 'lucide-react';

export default function Sidebar() {
  const { url } = usePage();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isActive = (route) => url.startsWith(route);

  const menuItems = [
    { 
      href: '/dashboard',
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    {
      href: '/products', 
      label: 'Products', 
      icon: Package,
      badge: null
    },
    {
      href: '/categories', 
      label: 'Categories', 
      icon: ListFilterIcon, 
      badge: null, 
    },
    { 
      href: '/sales', 
      label: 'Sales / POS', 
      icon: ShoppingCart,
      badge: '12' // Example badge
    },
    {
      href: '/customers', 
      label: 'Customers', 
      icon: UserCheck,
      badge: null
    },
    {
      href: '/suppliers', 
      label: 'Suppliers', 
      icon: Truck,
      badge: null
    },
    {
      href: '/purchases', 
      label: 'Purchases', 
      icon: ShoppingBag,
      badge: null
    },
    {
      href: '/stock-movements', 
      label: 'Stock Movements', 
      icon: Package2,
      badge: null
    },
    { 
      href: '/reports', 
      label: 'Reports', 
      icon: BarChart3,
      badge: null
    },
    { 
      href: '/users', 
      label: 'Users', 
      icon: Users,
      badge: null
    },
    { 
      href: '/roles', 
      label: 'Roles & Permissions', 
      icon: Shield,
      badge: null
    },
    {
      href: '/profile', 
      label: 'Profile Settings', 
      icon: Settings,
      badge: null
    },
  ];

  const renderMenuItem = (item) => {
    const active = isActive(item.href);
    const IconComponent = item.icon;
    
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
          ${active 
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }
        `}
      >
        <span className={`
          transition-colors duration-200
          ${active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}
        `}>
          <IconComponent size={20} strokeWidth={2} />
        </span>
        
        <span className="flex-1">{item.label}</span>
        
        {/* Badge */}
        {item.badge && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
            {item.badge}
          </span>
        )}
        
        {/* Active indicator */}
        {active && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col shadow-2xl">
      {/* Logo/Brand Section */}
      <div className="px-6 py-6 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-4 4" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl leading-tight">
              UMKM<span className="text-emerald-400">POS</span>
            </h2>
            <p className="text-slate-400 text-xs">Point of Sale</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
              Main
            </h3>
            <div className="space-y-1">
              {menuItems.slice(0, 4).map(renderMenuItem)}
            </div>
          </div>

          {/* Inventory Management */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
              Inventory
            </h3>
            <div className="space-y-1">
              {menuItems.slice(4, 8).map(renderMenuItem)}
            </div>
          </div>

          {/* Administration */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
              Administration
            </h3>
            <div className="space-y-1">
              {menuItems.slice(8).map(renderMenuItem)}
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 group border border-slate-700/30"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <User size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@umkmpos.com</p>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden z-50">
              <div className="py-2">
                <Link 
                  href="/profile"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                >
                  <User size={16} />
                  <span>Profile Settings</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200">
                  <Settings size={16} />
                  <span>Preferences</span>
                </button>
                <div className="border-t border-slate-700/50 my-2"></div>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>  
  );
}