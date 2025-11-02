import AdminLayout from '@/layouts/admin/AdminLayout';
import { dashboard as adminDashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    DialogFooter,
    DialogHeader,
    DialogTitle
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
import { Vehicle } from '@/types/vehicle';

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

// Simplified Vehicle type for the form
interface VehicleFormData {
    brand: string;
    model: string;
    production_year: number;
    plate_no: string;
    base_daily_rate: number;
    status: 'active' | 'maintenance' | 'retired';
}

export default function VehicleManagement({ vehicles: initialVehicles }: Props) {
    // State for vehicles
    const [vehicles] = useState<Vehicle[]>(initialVehicles || []);

    // State for the form
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

    // Default form values
    const defaultFormValues: VehicleFormData = {
        brand: '',
        model: '',
        production_year: new Date().getFullYear(),
        plate_no: '',
        base_daily_rate: 0,
        status: 'active'
    };

    // Inertia form for creating/updating vehicles
    const { data, setData, post, put, processing, errors, reset } = useForm<VehicleFormData>(defaultFormValues);

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

    // Delete a vehicle
    const handleDelete = () => {
        if (currentVehicle) {
            router.delete(route('admin.vehicle-management.destroy', currentVehicle.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setCurrentVehicle(null);
                    toast({
                        title: 'Success',
                        description: 'Vehicle deleted successfully',
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
            model: vehicle.model,
            production_year: vehicle.production_year,
            plate_no: vehicle.plate_no,
            base_daily_rate: vehicle.base_daily_rate,
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

    // Open delete confirmation
    const handleDeleteConfirm = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        setIsDeleteDialogOpen(true);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle Management" />
            
            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Vehicle Management</h1>

                    <div className="flex gap-2">
                        <Button onClick={undefined}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Vehicle
                        </Button>

                        <Button onClick={handleCreate}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Brand
                        </Button>
                    </div>

                </div>
                
                
                {/* Vehicle Table */}
                <div className="bg-background rounded-lg shadow overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brand</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Plate No.</TableHead>
                                <TableHead>Daily Rate</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        No vehicles found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell>{vehicle.brand}</TableCell>
                                        <TableCell>{vehicle.model}</TableCell>
                                        <TableCell>{vehicle.production_year}</TableCell>
                                        <TableCell>{vehicle.plate_no}</TableCell>
                                        <TableCell>${vehicle.base_daily_rate}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                vehicle.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : vehicle.status === 'maintenance'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {vehicle.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleEdit(vehicle)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleDeleteConfirm(vehicle)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Create/Edit Dialog */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {currentVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        name="brand"
                                        value={data.brand}
                                        onChange={handleChange}
                                    />
                                    {errors.brand && (
                                        <p className="text-red-500 text-sm">{errors.brand}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Input
                                        id="model"
                                        name="model"
                                        value={data.model}
                                        onChange={handleChange}
                                    />
                                    {errors.model && (
                                        <p className="text-red-500 text-sm">{errors.model}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="production_year">Production Year</Label>
                                    <Input
                                        id="production_year"
                                        name="production_year"
                                        type="number"
                                        value={data.production_year}
                                        onChange={handleChange}
                                    />
                                    {errors.production_year && (
                                        <p className="text-red-500 text-sm">{errors.production_year}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="plate_no">Plate Number</Label>
                                    <Input
                                        id="plate_no"
                                        name="plate_no"
                                        value={data.plate_no}
                                        onChange={handleChange}
                                    />
                                    {errors.plate_no && (
                                        <p className="text-red-500 text-sm">{errors.plate_no}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="base_daily_rate">Base Daily Rate</Label>
                                    <Input
                                        id="base_daily_rate"
                                        name="base_daily_rate"
                                        type="number"
                                        step="0.01"
                                        value={data.base_daily_rate}
                                        onChange={handleChange}
                                    />
                                    {errors.base_daily_rate && (
                                        <p className="text-red-500 text-sm">{errors.base_daily_rate}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select 
                                        name="status" 
                                        value={data.status} 
                                        onValueChange={(value) => handleSelectChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="retired">Retired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-red-500 text-sm">{errors.status}</p>
                                    )}
                                </div>
                            </div>
                            
                            <DialogFooter>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {currentVehicle ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                
                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the vehicle
                                {currentVehicle && ` "${currentVehicle.brand} ${currentVehicle.model}"`}.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}