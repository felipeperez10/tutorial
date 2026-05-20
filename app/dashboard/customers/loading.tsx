import { lusitana } from '@/app/ui/fonts';

// Shimmer animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

function CustomerRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100" />
          <div className="h-6 w-24 rounded bg-gray-100" />
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-12 rounded bg-gray-100" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-20 rounded bg-gray-100" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-20 rounded bg-gray-100" />
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100" />
          <div className="h-[38px] w-[38px] rounded bg-gray-100" />
        </div>
      </td>
    </tr>
  );
}

function CustomerMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100" />
          <div className="h-6 w-24 rounded bg-gray-100" />
        </div>
        <div className="h-6 w-32 rounded bg-gray-100" />
      </div>
      <div className="flex w-full items-center justify-between border-b py-5">
        <div className="flex w-1/2 flex-col gap-2">
          <div className="h-4 w-12 rounded bg-gray-100" />
          <div className="h-5 w-20 rounded bg-gray-100" />
        </div>
        <div className="flex w-1/2 flex-col gap-2">
          <div className="h-4 w-12 rounded bg-gray-100" />
          <div className="h-5 w-20 rounded bg-gray-100" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="h-4 w-24 rounded bg-gray-100" />
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded bg-gray-100" />
          <div className="h-10 w-10 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>
      {/* Search bar skeleton */}
      <div className="relative flex flex-1 flex-shrink-0">
        <div className="h-10 w-full rounded-lg bg-gray-100" />
      </div>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className={`${shimmer} relative overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0`}>
              {/* Mobile skeletons */}
              <div className="md:hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CustomerMobileSkeleton key={i} />
                ))}
              </div>
              {/* Desktop table skeleton */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
                    <th className="px-3 py-5 font-medium">Email</th>
                    <th className="px-3 py-5 font-medium">Total Invoices</th>
                    <th className="px-3 py-5 font-medium">Total Pending</th>
                    <th className="px-4 py-5 font-medium">Total Paid</th>
                    <th className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CustomerRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
