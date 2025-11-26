import AdminLayout from '@/layouts/admin/AdminLayout'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

type Order = {
  id: number
  end_at: string
  is_completable?: boolean
  items?: { id: number }[]
}

export default function AdminOrdersOngoing({ orders = [] as Order[] }: { orders?: Order[] }) {
  return (
    <AdminLayout title="On Going" description="Active rentals.">
      <Head title="On Going" />
      <div className="grid gap-4">
        {orders.length === 0 && <div className="text-muted-foreground">No ongoing orders</div>}
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between rounded-md border p-4">
            <div className="flex flex-col">
              <span className="font-medium">Order #{o.id}</span>
              <span className="text-sm text-muted-foreground">Ends {new Date(o.end_at).toLocaleDateString()}</span>
              <span className="text-sm">Items {o.items?.length ?? 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/orders/${o.id}/complete`} method="post"><Button disabled={!o.is_completable}>Complete</Button></Link>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
