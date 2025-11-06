import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Vehicle } from '@/types/vehicle';

// Simple toast function (placeholder)
const toast = (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    console.log(`${props.title}: ${props.description}`);
};

export function useVehicleManagement(initialVehicles: Vehicle[]) {
    // Derive vehicles directly from props to avoid stale state after navigation
    const vehicles = initialVehicles || [];

    // State for modal dialogs
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

    // Helper function to generate route URLs
    const route = (name: string, params?: unknown): string => {
        if (name === 'admin.vehicle-management.update') {
            return `/admin/vehicle-management/${params}`;
        } else if (name === 'admin.vehicle-management.store') {
            return '/admin/vehicle-management';
        } else if (name === 'admin.vehicle-management.destroy') {
            return `/admin/vehicle-management/${params}`;
        }
        return '/admin/vehicle-management';
    };

    // Delete a vehicle (server handles persistence; page re-renders with fresh props)
    const handleDelete = () => {
        if (currentVehicle) {
            router.delete(route('admin.vehicle-management.destroy', currentVehicle.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setCurrentVehicle(null);
                    toast({ title: 'Success', description: 'Vehicle deleted successfully' });
                },
            });
        }
    };

    // Open delete confirmation
    const handleDeleteConfirm = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        setIsDeleteDialogOpen(true);
    };

    return {
        vehicles,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        currentVehicle,
        setCurrentVehicle,
        handleDelete,
        handleDeleteConfirm,
    };
}