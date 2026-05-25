import { fetchProductById } from '@/app/lib/data';
import EditProductForm from '@/app/ui/products/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/app/lib/definitions';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          { label: 'Edit Product', href: `/dashboard/products/${id}/edit`, active: true },
        ]}
      />
      <EditProductForm product={product as ProductForm} />
    </main>
  );
}
