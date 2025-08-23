import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, X, Package, Palette, ToggleLeft, ToggleRight } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ auth, category }) {
  const { data, setData, put, processing, errors } = useForm({
    name: category.name || '',
    description: category.description || '',
    color: category.color || '#10b981',
    is_active: category.is_active ?? true,
  });

  const [selectedColor, setSelectedColor] = useState(category.color || '#10b981');

  const predefinedColors = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#ec4899', // pink
    '#6b7280', // gray
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('categories.update', category.id));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setData('color', color);
  };

  return (
    <AppLayout user={auth.user}>
      <Head title={`Edit ${category.name}`} />

      <div className="min-h-screen bg-slate-50">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={route('categories.index')}
              className="inline-flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Kategori</h1>
              <p className="text-slate-600 mt-1">Perbarui informasi kategori "{category.name}"</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div onSubmit={handleSubmit}>
              {/* Form Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Package size={16} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Detail Kategori</h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Package size={14} />
                    <span>{category.products_count || 0} produk</span>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Preview Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-3">Preview Kategori</p>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm"
                          style={{ backgroundColor: selectedColor }}
                        >
                          {data.name ? data.name.charAt(0).toUpperCase() : 'K'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">
                              {data.name || 'Nama Kategori'}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                              data.is_active 
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-50 text-slate-600'
                            }`}>
                              {data.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {data.description || 'Deskripsi kategori akan muncul di sini'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Status Kategori
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setData('is_active', !data.is_active)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        data.is_active
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {data.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      {data.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                    <p className="text-sm text-slate-500">
                      {data.is_active 
                        ? 'Kategori dapat digunakan untuk produk'
                        : 'Kategori tidak akan tampil dalam pilihan'
                      }
                    </p>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Nama Kategori *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Masukkan nama kategori"
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Masukkan deskripsi kategori (opsional)"
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors.description 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X size={14} />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Color Field */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Palette size={16} />
                    Warna Kategori
                  </label>
                  <div className="space-y-3">
                    {/* Color Picker */}
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Pilih Warna Kustom</p>
                        <p className="text-xs text-slate-500">Klik untuk membuka color picker</p>
                      </div>
                    </div>
                    
                    {/* Predefined Colors */}
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Atau pilih dari warna yang tersedia:</p>
                      <div className="grid grid-cols-5 gap-2">
                        {predefinedColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleColorChange(color)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all ${
                              selectedColor === color 
                                ? 'border-slate-400 scale-110' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {errors.color && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X size={14} />
                      {errors.color}
                    </p>
                  )}
                </div>

                {/* Warning if category has products */}
                {category.products_count > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Package size={14} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Perhatian</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Kategori ini memiliki {category.products_count} produk. Perubahan nama atau status akan mempengaruhi semua produk yang terkait.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    <span className="text-red-500">*</span> Field wajib diisi
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      href={route('categories.index')}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      Batal
                    </Link>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={processing}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Update Kategori
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Info */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Informasi Kategori</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dibuat:</span>
                  <span className="text-slate-900">{new Date(category.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diupdate:</span>
                  <span className="text-slate-900">{new Date(category.updated_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Produk:</span>
                  <span className="text-slate-900">{category.products_count || 0}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Gunakan nama yang konsisten dan mudah dipahami</li>
                <li>• Warna membantu identifikasi visual yang cepat</li>
                <li>• Nonaktifkan kategori untuk menyembunyikan dari pilihan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}