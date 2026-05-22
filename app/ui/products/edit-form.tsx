'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductForm } from '@/app/lib/definitions';

type FieldErrors = Record<string, string[]>;

export default function EditProductForm({ product }: { product: ProductForm }) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
    };

    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors ?? {});
      setMessage(data.error ?? 'Failed to update product.');
      setPending(false);
      return;
    }

    router.push('/dashboard/products');
    router.refresh();
  }

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">Name</label>
          <input
            id="name" name="name" type="text" defaultValue={product.name}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
          <input
            id="description" name="description" type="text" defaultValue={product.description}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description[0]}</p>}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">Price (ARS)</label>
          <input
            id="price" name="price" type="number" defaultValue={product.price}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price[0]}</p>}
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">Stock</label>
          <input
            id="stock" name="stock" type="number" defaultValue={product.stock}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock[0]}</p>}
        </div>

        {message && <p className="mt-2 text-sm text-red-500">{message}</p>}

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/products"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
