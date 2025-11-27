"use client"

import { VehicleCard } from "@/components/ui/vehicle-card"
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '@/layouts/user/UserLayout';
import { Button } from '@/components/ui/button'
import { useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
 

type Vehicle = {
  id: number
  brand?: string
  model?: string
  production_year?: number | null
  transmission?: string | null
  image_url?: string | null
  primary_image_alt?: string | null
  price_daily_idr?: number | null
  price_weekly_idr?: number | null
  price_monthly_idr?: number | null
  seat_count?: number | null
  in_cart?: boolean
}

export default function Vehicles({ vehicles = [] as Vehicle[] }: { vehicles?: Vehicle[] }) {
  const [selectedIds, setSelectedIds] = useState<number[]>(() => vehicles.filter((v) => v.in_cart).map((v) => v.id))
  const selectedVehicles = useMemo(() => vehicles.filter((v) => selectedIds.includes(v.id)), [vehicles, selectedIds])
  const [timeTypesById, setTimeTypesById] = useState<Record<number, 'daily' | 'weekly' | 'monthly'>>(() => {
    const initial: Record<number, 'daily' | 'weekly' | 'monthly'> = {}
    for (const v of vehicles) {
      if (v.in_cart) initial[v.id] = 'daily'
    }
    return initial
  })
  const [durationUnitsById, setDurationUnitsById] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {}
    for (const v of vehicles) {
      if (v.in_cart) initial[v.id] = 1
    }
    return initial
  })
  const [startDatesById, setStartDatesById] = useState<Record<number, string>>(() => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    const iso = `${y}-${m}-${d}`
    const initial: Record<number, string> = {}
    for (const v of vehicles) {
      if (v.in_cart) initial[v.id] = iso
    }
    return initial
  })
  return (
    <UserLayout breadcrumbs={[{ title: 'Vehicles', href: '/dashboard/vehicles' }]}> 
      <Head title="Vehicles" />
      <div className="container mx-auto px-4 py-6">
        {selectedVehicles.length > 0 && (
          <div className="mb-6 rounded-xl border bg-card text-card-foreground p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Cart</div>
              <div className="flex items-center gap-2">
                <Link href="/checkout" className="inline-flex"><Button size="sm">Checkout</Button></Link>
              </div>
            </div>
            <div className="grid gap-2">
              {selectedVehicles.map((sv) => (
                <div key={sv.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{[sv.brand, sv.model].filter(Boolean).join(' ')}</span>
                    <span className="text-sm text-muted-foreground">{[sv.transmission, (sv.seat_count ?? '') && `${sv.seat_count} seats`].filter(Boolean).join(' • ')}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Date</span>
                        <Input
                          type="date"
                          className="h-8"
                          value={startDatesById[sv.id] ?? ''}
                          onChange={(e) => {
                            const val = e.target.value
                            setStartDatesById((prev) => ({ ...prev, [sv.id]: val }))
                            router.post(`/cart/items/by-vehicle/${sv.id}/config`, {
                              time_type: timeTypesById[sv.id] ?? 'daily',
                              duration_units: durationUnitsById[sv.id] ?? 1,
                              start_at: val,
                            })
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Pricing</span>
                        <Select
                          value={timeTypesById[sv.id] ?? 'daily'}
                          onValueChange={(v) => {
                            const tt = v as 'daily' | 'weekly' | 'monthly'
                            setTimeTypesById((prev) => ({ ...prev, [sv.id]: tt }))
                            router.post(`/cart/items/by-vehicle/${sv.id}/config`, {
                              time_type: tt,
                              duration_units: durationUnitsById[sv.id] ?? 1,
                              start_at: startDatesById[sv.id] ?? undefined,
                            })
                          }}
                        >
                          <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Qty</span>
                        <Input
                          type="number"
                          min={1}
                          className="h-8 w-20"
                          value={durationUnitsById[sv.id] ?? 1}
                          onChange={(e) => {
                            const val = Math.max(1, Number(e.target.value || 1))
                            setDurationUnitsById((prev) => ({ ...prev, [sv.id]: val }))
                            router.post(`/cart/items/by-vehicle/${sv.id}/config`, {
                              time_type: timeTypesById[sv.id] ?? 'daily',
                              duration_units: val,
                              start_at: startDatesById[sv.id] ?? undefined,
                            })
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            const tt = timeTypesById[sv.id] ?? 'daily'
                            const du = durationUnitsById[sv.id] ?? 1
                            const unitLabel = tt === 'weekly' ? (du === 1 ? 'week' : 'weeks') : tt === 'monthly' ? (du === 1 ? 'month' : 'months') : (du === 1 ? 'day' : 'days')
                            const startStr = startDatesById[sv.id] ?? ''
                            const start = new Date(startStr)
                            if (isNaN(start.getTime())) return `Rent: ${du} ${unitLabel}`
                            const end = new Date(start)
                            if (tt === 'weekly') { end.setDate(end.getDate() + du * 7) } else if (tt === 'monthly') { end.setMonth(end.getMonth() + du) } else { end.setDate(end.getDate() + du) }
                            const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
                            return `Rent: ${du} ${unitLabel} (${fmt(start)} → ${fmt(end)})`
                          })()}
                        </span>
                      </div>
                      <span className="text-sm">
                        {(() => {
                          const tt = timeTypesById[sv.id] ?? 'daily'
                          if (tt === 'weekly') return <>Weekly: IDR {sv.price_weekly_idr ?? 0}</>
                          if (tt === 'monthly') return <>Monthly: IDR {sv.price_monthly_idr ?? 0}</>
                          return <>Daily: IDR {sv.price_daily_idr ?? 0}</>
                        })()}
                        {' '}× {durationUnitsById[sv.id] ?? 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.delete(`/cart/items/by-vehicle/${sv.id}`, {
                          onSuccess: () => {
                            setSelectedIds((prev) => prev.filter((id) => id !== sv.id))
                            setTimeTypesById((prev) => {
                              const rest = { ...prev }
                              delete rest[sv.id]
                              return rest
                            })
                            setDurationUnitsById((prev) => {
                              const rest = { ...prev }
                              delete rest[sv.id]
                              return rest
                            })
                            setStartDatesById((prev) => {
                              const rest = { ...prev }
                              delete rest[sv.id]
                              return rest
                            })
                          },
                        })
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="flex flex-col items-start gap-3">
              <VehicleCard
                name={[v.brand, v.model].filter(Boolean).join(" ")}
                description={[v.production_year, v.transmission].filter(Boolean).join(" • ")}
                image={v.image_url ?? "/logo.svg"}
                seatCount={v.seat_count ?? null}
                transmission={v.transmission ?? null}
                priceDailyIdr={v.price_daily_idr ?? null}
                vehicleId={v.id}
                inCart={selectedIds.includes(v.id)}
                onRent={() => {
                  if (v.id != null) {
                    router.post('/cart/items', { vehicle_id: v.id }, {
                      onSuccess: () => {
                        setSelectedIds((prev) => (prev.includes(v.id) ? prev : [...prev, v.id]))
                        setTimeTypesById((prev) => ({ ...prev, [v.id]: prev[v.id] ?? 'daily' }))
                        setDurationUnitsById((prev) => ({ ...prev, [v.id]: prev[v.id] ?? 1 }))
                        setStartDatesById((prev) => {
                          if (prev[v.id]) return prev
                          const today = new Date()
                          const y = today.getFullYear()
                          const m = String(today.getMonth() + 1).padStart(2, '0')
                          const d = String(today.getDate()).padStart(2, '0')
                          const iso = `${y}-${m}-${d}`
                          return { ...prev, [v.id]: iso }
                        })
                      },
                    })
                  }
                }}
                onAfterRemove={(id) => {
                  setSelectedIds((prev) => prev.filter((x) => x !== id))
                  setTimeTypesById((prev) => {
                    const rest = { ...prev }
                    delete rest[id]
                    return rest
                  })
                  setDurationUnitsById((prev) => {
                    const rest = { ...prev }
                    delete rest[id]
                    return rest
                  })
                  setStartDatesById((prev) => {
                    const rest = { ...prev }
                    delete rest[id]
                    return rest
                  })
                }}
              />
              <div className="flex items-center gap-3" />
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
