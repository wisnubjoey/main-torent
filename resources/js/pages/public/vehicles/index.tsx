"use client"

import { VehicleCard } from "@/components/ui/vehicle-card"
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/layouts/public/navbar';
import Footer from '@/layouts/public/footer';
import { Button } from '@/components/ui/button'
import type { Vehicle } from '@/types/vehicle'

type PublicVehicle = Vehicle & { image_url?: string | null; primary_image_alt?: string | null; price_daily_idr?: number | null }

export default function Vehicles({ vehicles = [] as PublicVehicle[] }: { vehicles?: PublicVehicle[] }) {
  return (
    <>
      <Head title="Public Vehicles" />
      <Navbar />
        <div className="container mx-auto px-4 py-8">
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
      <Footer />
    </>
  );
}
