import AdminLayout from '@/layouts/admin/AdminLayout'
import { Head } from '@inertiajs/react'

type Order = {
  id: number
  completed_at?: string | null
  total_amount_idr: number
}

export default function AdminOrdersHistory({ orders = [] as Order[] }: { orders?: Order[] }) {
  return (
    <AdminLayout title="History" description="Completed rentals.">
      <Head title="History" />
      <div className="grid gap-4">
        {orders.length === 0 && <div className="text-muted-foreground">No completed orders</div>}
        {orders.map((o) => (
          <div key={o.id} className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-sm">{o.completed_at ? new Date(o.completed_at).toLocaleDateString() : ''}</div>
            </div>
            <div className="mt-2">Total IDR {o.total_amount_idr}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

