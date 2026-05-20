import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateForm from '@/app/ui/customers/create-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Create Customer', href: '/dashboard/customers/create', active: true },
        ]}
      />
      <CreateForm />
    </main>
  );
}
