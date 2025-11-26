import AdminLayout from '@/layouts/admin/AdminLayout'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

type Order = {
  id: number
  user?: { id: number; name?: string | null }
  start_at: string
  end_at: string
  items?: { id: number }[]
}

export default function AdminOrdersApproval({ orders = [] as Order[] }: { orders?: Order[] }) {
  return (
    <AdminLayout title="Approval" description="Review incoming orders.">
      <Head title="Approval" />
      <div className="grid gap-4">
        {orders.length === 0 && <div className="text-muted-foreground">No orders waiting for approval</div>}
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between rounded-md border p-4">
            <div className="flex flex-col">
              <span className="font-medium">Order #{o.id}</span>
              <span className="text-sm text-muted-foreground">{new Date(o.start_at).toLocaleDateString()} → {new Date(o.end_at).toLocaleDateString()}</span>
              <span className="text-sm">Items {o.items?.length ?? 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/orders/${o.id}/approve`} method="post"><Button>Approve</Button></Link>
              <Link href={`/admin/orders/${o.id}/cancel`} method="post"><Button variant="outline">Cancel</Button></Link>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
