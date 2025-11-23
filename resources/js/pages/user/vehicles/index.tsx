import { DashboardVehicleCard } from "@/components/ui/dashboard-vehicle-card";
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import type { Vehicle } from '@/types/vehicle'

type UserVehicle = Vehicle & { image_url?: string | null; primary_image_alt?: string | null }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Vehicles',
        href: '/dashboard/vehicles',
    },
];

export default function Vehicles({ vehicles = [] as UserVehicle[] }: { vehicles?: UserVehicle[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicles" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {vehicles.map((v) => (
                            <DashboardVehicleCard
                                key={v.id}
                                name={[v.brand, v.model].filter(Boolean).join(" ")}
                                description={[v.production_year, v.transmission].filter(Boolean).join(" • ")}
                                image={v.image_url ?? "/logo.svg"}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
