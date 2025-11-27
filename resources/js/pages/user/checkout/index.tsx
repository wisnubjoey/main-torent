import UserLayout from '@/layouts/user/UserLayout'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

type Vehicle = {
  id: number
  model?: string
  production_year?: number | null
  seat_count?: number | null
  transmission?: string | null
  price_daily_idr?: number | null
  price_weekly_idr?: number | null
  price_monthly_idr?: number | null
  brand?: { id: number; name: string }
  vehicleClass?: { id: number; name: string }
}

type CartItem = {
  id: number
  quantity: number
  vehicle: Vehicle
}

type Cart = {
  id: number
  items: CartItem[]
}

export default function CheckoutIndex({ cart }: { cart: Cart }) {
  const url = usePage().url
  const initialTimeType = (() => {
    try {
      const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
      const tt = u.searchParams.get('time_type')
      return tt === 'weekly' || tt === 'monthly' ? tt : 'daily'
    } catch {
      return 'daily'
    }
  })()
  const today = new Date()
  const startAt = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  const form = useForm({ start_at: startAt, time_type: initialTimeType, duration_units: 1 })

  return (
    <UserLayout breadcrumbs={[{ title: 'Checkout', href: '/checkout' }]}> 
      <Head title="Checkout" />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Checkout</h2>
        <div className="grid gap-4 max-w-xl">
          {cart.items.length === 0 && (
            <div className="text-muted-foreground">Your cart is empty</div>
          )}
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border p-4">
              <div className="flex flex-col">
                <span className="font-medium">{[item.vehicle.brand?.name, item.vehicle.model].filter(Boolean).join(' ')}</span>
                <span className="text-sm text-muted-foreground">{item.vehicle.vehicleClass?.name ?? ''} • {item.vehicle.transmission ?? ''} • {item.vehicle.seat_count ?? ''} seats</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Qty {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => form.post('/checkout/apply')} disabled={form.processing}>Apply Order</Button>
          <Link href="/dashboard/vehicles" className="inline-flex"><Button variant="outline">Back</Button></Link>
        </div>
      </div>
    </UserLayout>
  )
}
