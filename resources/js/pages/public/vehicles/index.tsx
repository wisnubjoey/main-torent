"use client"

import { VehicleCard } from "@/components/ui/vehicle-card"
import { Head } from '@inertiajs/react';
import Navbar from '@/layouts/public/navbar';
import Footer from '@/layouts/public/footer';
import type { Vehicle } from '@/types/vehicle'

type PublicVehicle = Vehicle & { image_url?: string | null; primary_image_alt?: string | null }

export default function Vehicles({ vehicles = [] as PublicVehicle[] }: { vehicles?: PublicVehicle[] }) {
  return (
    <>
      <Head title="Public Vehicles" />
      <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                name={[v.brand, v.model].filter(Boolean).join(" ")}
                description={[v.production_year, v.transmission].filter(Boolean).join(" • ")}
                image={v.image_url ?? "/logo.svg"}
              />
            ))}
          </div>
        </div>
      <Footer />
    </>
  );
}