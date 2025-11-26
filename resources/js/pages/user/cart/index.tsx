import AppLayout from '@/layouts/app-layout'
import { Head, Link, usePage } from '@inertiajs/react'
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

export default function CartIndex({ cart }: { cart: Cart }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Cart', href: '/cart' }]}> 
      <Head title="My Cart" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cart</h2>
          <Link href="/checkout" className="inline-flex"><Button>Checkout</Button></Link>
        </div>
        <div className="grid gap-4">
          {cart.items.length === 0 && (
            <div className="text-muted-foreground">Your cart is empty</div>
          )}
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border p-4">
              <div className="flex flex-col">
                <span className="font-medium">{[item.vehicle.brand?.name, item.vehicle.model].filter(Boolean).join(' ')}</span>
                <span className="text-sm text-muted-foreground">{item.vehicle.vehicleClass?.name ?? ''} • {item.vehicle.transmission ?? ''} • {item.vehicle.seat_count ?? ''} seats</span>
                <span className="text-sm">Daily: IDR {item.vehicle.price_daily_idr ?? 0}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Qty {item.quantity}</span>
                <Link href={`/cart/items/${item.id}`} method="delete"><Button variant="outline">Remove</Button></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
