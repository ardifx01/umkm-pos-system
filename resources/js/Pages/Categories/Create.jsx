import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, X, Package, Palette } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    color: '#10b981',
  });

  const [selectedColor, setSelectedColor] = useState('#10b981');

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
    post(route('categories.store'));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setData('color', color);
  };

  return (
    <AppLayout user={auth.user}>
      <Head title="Tambah Kategori" />

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
              <h1 className="text-3xl font-bold text-slate-900">Tambah Kategori Baru</h1>
              <p className="text-slate-600 mt-1">Buat kategori baru untuk mengorganisir produk Anda</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div onSubmit={handleSubmit}>
              {/* Form Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Package size={16} className="text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Detail Kategori</h2>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Preview Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-3">Preview Kategori</p>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm"
                        style={{ backgroundColor: selectedColor }}
                      >
                        {data.name ? data.name.charAt(0).toUpperCase() : 'K'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {data.name || 'Nama Kategori'}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {data.description || 'Deskripsi kategori akan muncul di sini'}
                        </p>
                      </div>
                    </div>
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
                      type="submit"
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
                          Simpan Kategori
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gunakan nama kategori yang jelas dan mudah dipahami</li>
              <li>• Pilih warna yang berbeda untuk setiap kategori agar mudah dibedakan</li>
              <li>• Deskripsi membantu tim Anda memahami tujuan kategori</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}