import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Vehicle } from '@/types/vehicle';

// Simple toast function (placeholder)
const toast = (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    console.log(`${props.title}: ${props.description}`);
};

// Simplified Vehicle type for the form
interface VehicleFormData {
    brand: string;
    vehicle_class: string;
    model: string;
    production_year: number;
    plate_no: string;
    status: 'active' | 'maintenance' | 'retired';
}

export function useVehicleForm(initialVehicle: Vehicle | null = null) {
    // State for the form
    const [isOpen, setIsOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(initialVehicle);

    // Default form values
    const defaultFormValues: VehicleFormData = {
        brand: '',
        vehicle_class: 'luxury',
        model: '',
        production_year: new Date().getFullYear(),
        plate_no: '',
        status: 'active'
    };

    // Inertia form for creating/updating vehicles
    const { data, setData, post, put, processing, errors, reset } = useForm<VehicleFormData>(
        currentVehicle ? {
            brand: currentVehicle.brand,
            vehicle_class: currentVehicle.vehicle_class,
            model: currentVehicle.model,
            production_year: currentVehicle.production_year,
            plate_no: currentVehicle.plate_no,
            status: currentVehicle.status as 'active' | 'maintenance' | 'retired',
        } : defaultFormValues
    );

    // Helper function to generate route URLs
    const route = (name: string, params?: unknown): string => {
        if (name === 'admin.vehicle-management.update') {
            return `/admin/vehicle-management/${params}`;
        } else if (name === 'admin.vehicle-management.store') {
            return '/admin/vehicle-management';
        }
        return '/admin/vehicle-management';
    };

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            setData(name as keyof typeof data, parseFloat(value));
        } else {
            setData(name as keyof typeof data, value);
        }
    };

    // Handle select changes
    const handleSelectChange = (name: string, value: string) => {
        setData(name as keyof typeof data, value);
    };

    // Submit form for creating/updating vehicles
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (currentVehicle) {
            put(route('admin.vehicle-management.update', currentVehicle.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setCurrentVehicle(null);
                    toast({
                        title: 'Success',
                        description: 'Vehicle updated successfully',
                    });
                },
            });
        } else {
            post(route('admin.vehicle-management.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    toast({
                        title: 'Success',
                        description: 'Vehicle created successfully',
                    });
                },
            });
        }
    };

    // Open form for editing
    const handleEdit = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        setData({
            brand: vehicle.brand,
            vehicle_class: vehicle.vehicle_class,
            model: vehicle.model,
            production_year: vehicle.production_year,
            plate_no: vehicle.plate_no,
            status: vehicle.status as 'active' | 'maintenance' | 'retired',
        });
        setIsOpen(true);
    };

    // Open form for creating
    const handleCreate = () => {
        setCurrentVehicle(null);
        reset();
        setIsOpen(true);
    };

    return {
        isOpen,
        setIsOpen,
        currentVehicle,
        setCurrentVehicle,
        data,
        setData,
        processing,
        errors,
        handleChange,
        handleSelectChange,
        handleSubmit,
        handleEdit,
        handleCreate
    };
}