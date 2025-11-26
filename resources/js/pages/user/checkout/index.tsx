import AppLayout from '@/layouts/app-layout'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CheckoutIndex() {
  const form = useForm({ start_at: '', time_type: 'daily', duration_units: 1 })

  return (
    <AppLayout breadcrumbs={[{ title: 'Checkout', href: '/checkout' }]}> 
      <Head title="Checkout" />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Checkout</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); form.post('/checkout/apply') }}
          className="grid gap-4 max-w-xl"
        >
          <div className="grid gap-2">
            <label className="text-sm">Start date</label>
            <Input type="date" value={form.data.start_at}
              onChange={(e) => form.setData('start_at', e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Time type</label>
            <Select value={form.data.time_type} onValueChange={(v) => form.setData('time_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Duration</label>
            <Input type="number" min={1} value={form.data.duration_units}
              onChange={(e) => form.setData('duration_units', Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={form.processing}>Apply Order</Button>
            <Link href="/cart" className="inline-flex"><Button variant="outline">Back to Cart</Button></Link>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}

