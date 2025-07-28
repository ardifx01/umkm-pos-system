import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';

export default function Index({ products }) {
  return (
    <AppLayout user={usePage().props.auth.user}>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Daftar Produk</h2>
        <Link href="/products/create" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Tambah Produk
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Harga Jual</th>
              <th className="p-2 text-left">Stok</th>
              <th className="p-2 text-left">Satuan</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td className="p-4 text-center" colSpan={5}>Belum ada produk.</td>
              </tr>
            )}
            {products.map(product => (
              <tr key={product.id}>
                <td className="p-2">{product.name}</td>
                <td className="p-2">Rp{product.selling_price}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2">{product.unit}</td>
                <td className="p-2 text-center">
                  {/* Aksi nanti bisa edit/hapus */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
