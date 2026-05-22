'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TagIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';

type FieldErrors = Record<string, string[]>;

export default function CreateProductForm() {
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

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors ?? {});
      setMessage(data.error ?? 'Failed to create product.');
      setPending(false);
      return;
    }

    router.push('/dashboard/products');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">Name</label>
          <div className="relative">
            <input
              id="name" name="name" type="text" placeholder="Product name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.name && (
            <div id="name-error" aria-live="polite" className="mt-2 text-sm text-red-500">
              {errors.name.map((err) => <p key={err}>{err}</p>)}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
          <div className="relative">
            <textarea
              id="description" name="description" rows={3} placeholder="Product description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="description-error"
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500" />
          </div>
          {errors.description && (
            <div id="description-error" aria-live="polite" className="mt-2 text-sm text-red-500">
              {errors.description.map((err) => <p key={err}>{err}</p>)}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">Price (ARS)</label>
          <div className="relative">
            <input
              id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="price-error"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors.price && (
            <div id="price-error" aria-live="polite" className="mt-2 text-sm text-red-500">
              {errors.price.map((err) => <p key={err}>{err}</p>)}
            </div>
          )}
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">Stock</label>
          <div className="relative">
            <input
              id="stock" name="stock" type="number" min="0" step="1" placeholder="0"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="stock-error"
            />
            <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors.stock && (
            <div id="stock-error" aria-live="polite" className="mt-2 text-sm text-red-500">
              {errors.stock.map((err) => <p key={err}>{err}</p>)}
            </div>
          )}
        </div>

        {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" aria-disabled={pending}>
          {pending ? 'Saving...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
