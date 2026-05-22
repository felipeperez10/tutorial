'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });

    if (res.ok) {
      router.refresh();
    } else {
      alert('Failed to delete product.');
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
