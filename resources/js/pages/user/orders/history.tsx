import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'

type Order = {
  id: number
  completed_at?: string | null
  total_amount_idr: number
}

export default function OrdersHistory({ orders = [] as Order[] }: { orders?: Order[] }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Order History', href: '/orders/history' }]}> 
      <Head title="Order History" />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Order History</h2>
        <div className="grid gap-4">
          {orders.length === 0 && (
            <div className="text-muted-foreground">No completed orders</div>
          )}
          {orders.map((o) => (
            <div key={o.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm">Completed {o.completed_at ? new Date(o.completed_at).toLocaleDateString() : ''}</div>
              </div>
              <div className="mt-2">Total IDR {o.total_amount_idr}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

