import { fetchProductById } from '@/app/lib/data';
import { updateProduct } from '@/app/actions/product';
import EditProductForm from '@/app/ui/products/edit-form';
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) return <div>Product not found.</div>;

  return (
    <main>
      <h1>Edit Product</h1>
      <EditProductForm product={product} />
    </main>
  );
}