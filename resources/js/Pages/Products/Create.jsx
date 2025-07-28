import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, usePage } from '@inertiajs/react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    sku: '',
    purchase_price: '',
    selling_price: '',
    stock: '',
    unit: '',
    description: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/products');
  };

  return (
    <AppLayout user={usePage().props.auth.user}>
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Tambah Produk</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label>Nama Produk</label>
            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="input" />
            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>
          <div>
            <label>SKU</label>
            <input type="text" value={data.sku} onChange={e => setData('sku', e.target.value)} className="input" />
          </div>
          <div>
            <label>Harga Beli</label>
            <input type="number" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)} className="input" />
          </div>
          <div>
            <label>Harga Jual</label>
            <input type="number" value={data.selling_price} onChange={e => setData('selling_price', e.target.value)} className="input" />
          </div>
          <div>
            <label>Stok</label>
            <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="input" />
          </div>
          <div>
            <label>Satuan</label>
            <input type="text" value={data.unit} onChange={e => setData('unit', e.target.value)} className="input" />
          </div>
          <div>
            <label>Deskripsi</label>
            <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="input"></textarea>
          </div>
          <div>
            <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}