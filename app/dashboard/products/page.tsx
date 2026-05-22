import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ProductsTable } from '@/app/lib/definitions';
import DeleteProductButton from '@/app/ui/products/delete-button';

async function getProducts(query: string, page: number): Promise<{ products: ProductsTable[]; totalPages: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/api/products?query=${encodeURIComponent(query)}&page=${page}`,
    { cache: 'no-store' },
  );
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query ?? '';
  const currentPage = Number(params?.page) || 1;

  const { products } = await getProducts(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Link
          href="/dashboard/products/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <span className="hidden md:block">Create Product</span>
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">

              {/* Mobile */}
              <div className="md:hidden">
                {products.map((product) => (
                  <div key={product.id} className="mb-2 w-full rounded-md bg-white p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <p className="text-sm font-medium">{product.name}</p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <p className="font-medium">${Number(product.price).toLocaleString('es-AR')}</p>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Link href={`/dashboard/products/${product.id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
                        <PencilIcon className="w-5" />
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-5 font-medium">Description</th>
                    <th scope="col" className="px-3 py-5 font-medium">Price (ARS)</th>
                    <th scope="col" className="px-3 py-5 font-medium">Stock</th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {products.map((product) => (
                    <tr key={product.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm font-medium sm:pl-6">{product.name}</td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm text-gray-500">{product.description}</td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">${Number(product.price).toLocaleString('es-AR')}</td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">{product.stock}</td>
                      <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <Link href={`/dashboard/products/${product.id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
                            <span className="sr-only">Edit</span>
                            <PencilIcon className="w-5" />
                          </Link>
                          <DeleteProductButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  No products found.{' '}
                  <Link href="/dashboard/products/create" className="text-blue-500 underline">Create one</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
