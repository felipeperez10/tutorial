import { fetchFilteredProducts } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { CreateProduct, UpdateProduct, DeleteProduct } from '@/app/ui/products/buttons';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;

  const products = await fetchFilteredProducts(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateProduct />
      </div>

      {/* Table */}
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">

              {/* Mobile view */}
              <div className="md:hidden">
                {products.map((product) => (
                  <div key={product.id} className="mb-2 w-full rounded-md bg-white p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <p className="text-sm font-medium">{product.name}</p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <p className="font-medium">
                        ${Number(product.price).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-5 font-medium">Description</th>
                    <th scope="col" className="px-3 py-5 font-medium">Price</th>
                    <th scope="col" className="px-3 py-5 font-medium">Stock</th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {products.map((product) => (
                    <tr key={product.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm font-medium sm:pl-6">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm text-gray-500">
                        {product.description}
                      </td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                        ${Number(product.price).toLocaleString('es-AR')}
                      </td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                        {product.stock}
                      </td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                        <div className="flex justify-end gap-3">
                          <UpdateProduct id={product.id} />
                          <DeleteProduct id={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  No products found.{' '}
                  <Link href="/dashboard/products/create" className="text-blue-500 underline">
                    Create one
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
