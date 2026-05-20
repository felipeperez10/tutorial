import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import EditForm from '@/app/ui/customers/edit-form';
import { fetchCustomerById } from '@/app/lib/data';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await fetchCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Edit Customer', href: `/dashboard/customers/${id}/edit`, active: true },
        ]}
      />
      <EditForm customer={customer} />
    </main>
  );
}
