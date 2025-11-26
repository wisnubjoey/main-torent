"use client"

import { VehicleCard } from "@/components/ui/vehicle-card"
import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/user/UserLayout';
 

type Vehicle = {
  id: number
  brand?: string
  model?: string
  production_year?: number | null
  transmission?: string | null
  image_url?: string | null
  primary_image_alt?: string | null
  price_daily_idr?: number | null
  seat_count?: number | null
  in_cart?: boolean
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
                seatCount={v.seat_count ?? null}
                transmission={v.transmission ?? null}
                priceDailyIdr={v.price_daily_idr ?? null}
                vehicleId={v.id}
                inCart={v.in_cart ?? false}
              />
              <div className="flex items-center gap-3" />
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
