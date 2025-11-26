"use client"

import { VehicleCard } from "@/components/ui/vehicle-card"
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/layouts/user/UserLayout';
import { Button } from '@/components/ui/button'

type Vehicle = {
  id: number
  brand?: string
  model?: string
  production_year?: number | null
  transmission?: string | null
  image_url?: string | null
  primary_image_alt?: string | null
  price_daily_idr?: number | null
}

export default function Vehicles({ vehicles = [] as Vehicle[] }: { vehicles?: Vehicle[] }) {
  return (
    <UserLayout breadcrumbs={[{ title: 'Vehicles', href: '/dashboard/vehicles' }]}> 
      <Head title="Vehicles" />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="flex flex-col items-start gap-3">
              <VehicleCard
                name={[v.brand, v.model].filter(Boolean).join(" ")}
                description={[v.production_year, v.transmission].filter(Boolean).join(" • ")}
                image={v.image_url ?? "/logo.svg"}
              />
              <div className="flex items-center gap-3">
                {v.price_daily_idr != null && (
                  <span className="text-sm text-muted-foreground">Daily: IDR {v.price_daily_idr}</span>
                )}
                <Link href="/cart/items" method="post" data={{ vehicle_id: v.id }}>
                  <Button size="sm">Add to Cart</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
