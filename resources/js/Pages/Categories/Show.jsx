import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  Calendar, 
  Eye, 
  Grid, 
  List,
  Search,
  Filter,
  Star,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ auth, category }) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchProduct, setSearchProduct] = useState('');

  const products = category.products || [];
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-200 group">
      {/* Product Image */}
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-slate-400" />
          </div>
        )}
        
        {/* Product Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            product.is_active 
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-500 text-white'
          }`}>
            {product.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/products/${product.id}`}
            className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-slate-900 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-slate-500 line-clamp-1">{product.sku}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">
              Rp {new Intl.NumberFormat('id-ID').format(product.price || 0)}
            </p>
            <p className="text-xs text-slate-500">
              Stok: {product.stock || 0}
            </p>
          </div>
          
          {product.rating && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ProductRow = ({ product }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={24} className="text-slate-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
              product.is_active 
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-50 text-slate-600'
            }`}>
              {product.is_active ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>SKU: {product.sku}</span>
            <span>Stok: {product.stock || 0}</span>
            <span className="font-semibold text-slate-900">
              Rp {new Intl.NumberFormat('id-ID').format(product.price || 0)}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={12} fill="currentColor" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center justify-center w-8 h-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout user={auth.user}>
      <Head title={`Kategori ${category.name}`} />

      <div className="min-h-screen bg-slate-50">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={route('categories.index')}
              className="inline-flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: category.color || '#10b981' }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                      category.is_active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}>
                      {category.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {products.length} produk
                    </span>
                  </div>
                </div>
              </div>
              {category.description && (
                <p className="text-slate-600 text-lg">{category.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={route('categories.edit', category.id)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <Edit size={16} />
                Edit
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Produk</p>
                  <p className="text-2xl font-bold text-slate-900">{products.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Produk Aktif</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {products.filter(p => p.is_active).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Stok</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {products.reduce((total, product) => total + (product.stock || 0), 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Nilai Total</p>
                  <p className="text-2xl font-bold text-slate-900">
                    Rp {new Intl.NumberFormat('id-ID', { 
                      notation: 'compact', 
                      maximumFractionDigits: 1 
                    }).format(
                      products.reduce((total, product) => 
                        total + ((product.price || 0) * (product.stock || 0)), 0
                      )
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Kategori</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Dibuat</p>
                <div className="flex items-center gap-2 text-slate-900">
                  <Calendar size={16} />
                  <span>{new Date(category.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Terakhir Diupdate</p>
                <div className="flex items-center gap-2 text-slate-900">
                  <Calendar size={16} />
                  <span>{new Date(category.updated_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Warna</p>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border border-slate-200"
                    style={{ backgroundColor: category.color || '#10b981' }}
                  />
                  <span className="text-slate-900 font-mono text-sm">
                    {category.color || '#10b981'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Products Header */}
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Produk dalam Kategori ({products.length})
                </h2>
                <Link
                  href={`/products/create?category=${category.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 font-medium text-sm"
                >
                  <Package size={16} />
                  Tambah Produk
                </Link>
              </div>
            </div>

            {products.length > 0 && (
              <>
                {/* Search & Controls */}
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          placeholder="Cari produk..."
                          value={searchProduct}
                          onChange={(e) => setSearchProduct(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-72 text-sm"
                        />
                      </div>
                      
                      <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
                        <Filter size={16} />
                        Filter
                      </button>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === 'grid' 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Grid size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === 'list' 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className="p-6">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada produk ditemukan</h3>
                      <p className="text-slate-600">Coba ubah kata kunci pencarian Anda</p>
                    </div>
                  ) : (
                    <>
                      {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredProducts.map((product) => (
                            <ProductRow key={product.id} product={product} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada produk</h3>
                <p className="text-slate-600 mb-6">Mulai dengan menambahkan produk pertama ke kategori ini</p>
                <Link
                  href={`/products/create?category=${category.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 font-medium"
                >
                  <Package size={18} />
                  Tambah Produk
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}