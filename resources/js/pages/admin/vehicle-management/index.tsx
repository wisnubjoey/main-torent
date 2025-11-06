import AdminLayout from '@/layouts/admin/AdminLayout';
import { dashboard as adminDashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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
import { useVehicleManagement } from '@/hooks/vehicle-management-hooks/use-vehicle-management';
import { useVehicleForm } from '@/hooks/vehicle-management-hooks/use-vehicle-form';

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

interface Brand { id: number; name: string }
interface VehicleClass { id: number; name: string }
interface Props {
    vehicles: Vehicle[];
    brands: Brand[];
    classes: VehicleClass[];
}

export default function VehicleManagement({ vehicles: initialVehicles, brands, classes }: Props) {
    // Use the vehicle management hook
    const {
        vehicles,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        currentVehicle: deleteVehicle,
        handleDelete,
        handleDeleteConfirm
    } = useVehicleManagement(initialVehicles);

    // Use the vehicle form hook
    const {
        isOpen,
        setIsOpen,
        currentVehicle,
        data,
        errors,
        processing,
        handleChange,
        handleSelectChange,
        handleSubmit,
        handleEdit,
        handleCreate
    } = useVehicleForm();

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle Management" />
            
            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Vehicle Management</h1>

                    <div className="flex gap-2">
                        <Button onClick={handleCreate}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Vehicle
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/admin/brand-management">Manage Brands</a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/admin/vehicle-class-management">Manage Classes</a>
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
                                    <Select
                                        name="brand"
                                        value={data.brand}
                                        onValueChange={(value) => handleSelectChange('brand', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((b) => (
                                                <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                    <Label htmlFor="vehicle_class">Vehicle Class</Label>
                                    <Select
                                        name="vehicle_class"
                                        value={data.vehicle_class}
                                        onValueChange={(value) => handleSelectChange('vehicle_class', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((c) => (
                                                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vehicle_class && (
                                        <p className="text-red-500 text-sm">{errors.vehicle_class}</p>
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
                                {deleteVehicle && ` "${deleteVehicle.brand} ${deleteVehicle.model}"`}.
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