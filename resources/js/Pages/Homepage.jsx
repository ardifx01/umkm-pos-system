
import React from 'react';
import { Head } from '@inertiajs/react';

export default function Homepage({ title, user }) {
  return (
    <>
      <Head title={title} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p>Selamat datang, {user.name}!</p>
      </div>
    </>
  );
}