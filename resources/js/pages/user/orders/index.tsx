import UserLayout from '@/layouts/user/UserLayout'
import { Head } from '@inertiajs/react'

type OrderItem = {
  id: number
  vehicle_id: number
  quantity: number
  unit_price_idr: number
  subtotal_idr: number
  vehicle?: { id: number; brand?: { name: string }; model?: string }
}

type Order = {
  id: number
  status: string
  start_at: string
  end_at: string
  total_amount_idr: number
  items: OrderItem[]
}

export default function OrdersIndex({ orders = [] as Order[] }: { orders?: Order[] }) {
  return (
    <UserLayout breadcrumbs={[{ title: 'My Orders', href: '/orders' }]}> 
      <Head title="My Orders" />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <div className="grid gap-4">
          {orders.length === 0 && (
            <div className="text-muted-foreground">No active orders</div>
          )}
          {orders.map((o) => (
            <div key={o.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm">{o.status}</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{new Date(o.start_at).toLocaleDateString()} → {new Date(o.end_at).toLocaleDateString()}</div>
              <div className="mt-2">Total IDR {o.total_amount_idr}</div>
              <div className="mt-3 space-y-1">
                {o.items.map((it) => (
                  <div key={it.id} className="text-sm text-muted-foreground">
                    {it.vehicle?.brand?.name ?? ''} {it.vehicle?.model ?? ''} × {it.quantity} — IDR {it.subtotal_idr}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  )
}
