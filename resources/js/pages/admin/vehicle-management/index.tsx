import AdminLayout from '@/layouts/admin/AdminLayout';
import { dashboard as adminDashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Vehicle, VehicleFormData } from '@/types/vehicle';

// Define a simple toast function as a placeholder
const toast = (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    console.log(`${props.title}: ${props.description}`);
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: adminDashboard().url,
    },
    {
        title: 'Vehicle Management',
        href: '/admin/vehicle-management',
    },
];

interface Props {
    vehicles: Vehicle[];
}

export default function VehicleManagement({ vehicles: initialVehicles }: Props) {
    // State for vehicles
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles || []);

    // State for the form
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

    // Inertia form for creating/updating vehicles
    const { data, setData, post, put, processing, errors, reset } = useForm<VehicleFormData>({
        name: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, name === 'year' ? parseInt(value) : value);
    };

    // Helper function to generate route URLs
    const route = (name: string, params?: unknown): string => {
        // This is a simplified implementation - in a real app, you'd use Inertia's route function
        if (name === 'admin.vehicle-management.update') {
            return `/admin/vehicle-management/${params}`;
        } else if (name === 'admin.vehicle-management.store') {
            return '/admin/vehicle-management';
        } else if (name === 'admin.vehicle-management.destroy') {
            return `/admin/vehicle-management/${params}`;
        }
        return '/admin/vehicle-management';
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (currentVehicle) {
            // Update existing vehicle
            put(route('admin.vehicle-management.update', currentVehicle.id), {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Vehicle updated successfully',
                    });
                    handleCloseDialog();
                    // Refresh the vehicles list
                    setVehicles(prev => 
                        prev.map(v => v.id === currentVehicle.id ? { ...v, ...data as unknown as Vehicle } : v)
                    );
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to update vehicle',
                        variant: 'destructive',
                    });
                }
            });
        } else {
            // Add new vehicle
            post(route('admin.vehicle-management.store'), {
                onSuccess: (page) => {
                    toast({
                        title: 'Success',
                        description: 'Vehicle created successfully',
                    });
                    handleCloseDialog();
                    // Add the new vehicle to the list
                    if (page.props?.vehicle) {
                        setVehicles(prev => [...prev, page.props.vehicle as Vehicle]);
                    }
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to create vehicle',
                        variant: 'destructive',
                    });
                }
            });
        }
    };

    // Handle edit vehicle
    const handleEdit = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        setData({
            name: vehicle.name,
            model: vehicle.model,
            year: vehicle.year,
            license_plate: vehicle.license_plate,
        });
        setIsOpen(true);
    };

    // Handle delete vehicle
    const handleDelete = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        setIsDeleteDialogOpen(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        if (currentVehicle) {
            // Delete the vehicle using fetch instead of window.axios
            fetch(route('admin.vehicle-management.destroy', currentVehicle.id), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            })
                .then(response => {
                    if (response.ok) {
                        toast({
                            title: 'Success',
                            description: 'Vehicle deleted successfully',
                        });
                        // Remove the vehicle from the list
                        setVehicles(prev => prev.filter(v => v.id !== currentVehicle.id));
                    } else {
                        throw new Error('Failed to delete vehicle');
                    }
                })
                .catch(() => {
                    toast({
                        title: 'Error',
                        description: 'Failed to delete vehicle',
                        variant: 'destructive',
                    });
                });
        }
        setIsDeleteDialogOpen(false);
    };

    // Close dialog and reset form
    const handleCloseDialog = () => {
        setIsOpen(false);
        setCurrentVehicle(null);
        reset();
    };

    return (
        <AdminLayout
            title="Vehicle Management"
            description="Manage vehicles and their details"
            breadcrumbs={breadcrumbs}
        >
            <Head title="Vehicle Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Vehicle Management</h1>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setCurrentVehicle(null);
                                reset();
                            }}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Vehicle
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {currentVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                                </DialogTitle>
                                <DialogDescription>
                                    {currentVehicle
                                        ? 'Edit the details of the vehicle below.'
                                        : 'Add the details of the new vehicle below.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            className="col-span-3"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.name}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="model" className="text-right">
                                            Model
                                        </Label>
                                        <Input
                                            id="model"
                                            name="model"
                                            value={data.model}
                                            onChange={handleChange}
                                            className="col-span-3"
                                        />
                                        {errors.model && (
                                            <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.model}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="year" className="text-right">
                                            Year
                                        </Label>
                                        <Input
                                            id="year"
                                            name="year"
                                            type="number"
                                            value={data.year}
                                            onChange={handleChange}
                                            className="col-span-3"
                                        />
                                        {errors.year && (
                                            <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.year}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="license_plate" className="text-right">
                                            License Plate
                                        </Label>
                                        <Input
                                            id="license_plate"
                                            name="license_plate"
                                            value={data.license_plate}
                                            onChange={handleChange}
                                            className="col-span-3"
                                        />
                                        {errors.license_plate && (
                                            <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.license_plate}</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>License Plate</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6">
                                        No vehicles found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell>{vehicle.id}</TableCell>
                                        <TableCell>{vehicle.name}</TableCell>
                                        <TableCell>{vehicle.model}</TableCell>
                                        <TableCell>{vehicle.year}</TableCell>
                                        <TableCell>{vehicle.license_plate}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(vehicle)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(vehicle)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                vehicle from the database.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}