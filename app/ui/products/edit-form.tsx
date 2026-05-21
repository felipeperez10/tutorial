'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { updateProduct } from '@/app/actions/product';
import { ProductForm } from '@/app/lib/definitions';

export default function EditProductForm({ product }: { product: ProductForm }) {
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useActionState(updateProductWithId, {
    message: null,
    errors: {},
  });

return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <form action={formAction}>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={product.name}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {state.errors?.name && (
            <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            defaultValue={product.description}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {state.errors?.description && (
            <p className="mt-1 text-xs text-red-500">{state.errors.description[0]}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price (ARS)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            defaultValue={product.price}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {state.errors?.price && (
            <p className="mt-1 text-xs text-red-500">{state.errors.price[0]}</p>
          )}
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product.stock}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {state.errors?.stock && (
            <p className="mt-1 text-xs text-red-500">{state.errors.stock[0]}</p>
          )}
        </div>

        {/* General error */}
        {state.message && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/products"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}
