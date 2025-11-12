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
import { PlusCircle, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { useVehicleManagement } from '@/hooks/vehicle-management-hooks/use-vehicle-management';
import { useVehicleForm } from '@/hooks/vehicle-management-hooks/use-vehicle-form';
import { useBrandClassManagement } from '@/hooks/vehicle-management-hooks/use-brand-class-management';
import { useVehicleImages } from '@/hooks/vehicle-management-hooks/use-vehicle-images';
import React from 'react';
import { usePagination } from '@/hooks/use-pagination';

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

    const {
        isBrandDialogOpen,
        isClassDialogOpen,
        editingBrand,
        editingClass,
        brandName,
        className,
        brandProcessing,
        classProcessing,
        setIsBrandDialogOpen,
        setIsClassDialogOpen,
        setBrandName,
        setClassName,
        openCreateBrand,
        openEditBrand,
        submitBrand,
        deleteBrand,
        openCreateClass,
        openEditClass,
        submitClass,
        deleteClass,
    } = useBrandClassManagement();

    // Images management via hook
    const {
        isImagesDialogOpen,
        setIsImagesDialogOpen,
        imagesVehicle,
        secImages,
        setSecImages,
        maxSecondary,
        imagesBusy,
        imagesError,
        primaryFile,
        setPrimaryFile,
        primaryAlt,
        setPrimaryAlt,
        uploadFiles,
        setUploadFiles,
        openImagesDialog,
        uploadPrimary,
        deletePrimary,
        uploadSecondary,
        deleteSecondary,
        promoteSecondary,
        saveAlt,
        saveReorder,
    } = useVehicleImages();

    // Pagination for Brands (5 items per page)
    const {
        items: paginatedBrands,
        currentPage: brandsPage,
        pageCount: brandsPageCount,
        nextPage: nextBrandsPage,
        prevPage: prevBrandsPage,
        setPage: setBrandsPage,
        canNextPage: canNextBrandsPage,
        canPrevPage: canPrevBrandsPage,
    } = usePagination(brands, 5);

    // Pagination for Classes (5 items per page)
    const {
        items: paginatedClasses,
        currentPage: classesPage,
        pageCount: classesPageCount,
        nextPage: nextClassesPage,
        prevPage: prevClassesPage,
        setPage: setClassesPage,
        canNextPage: canNextClassesPage,
        canPrevPage: canPrevClassesPage,
    } = usePagination(classes, 5);

    // Pagination for Vehicles (5 items per page)
    const {
        items: paginatedVehicles,
        currentPage: vehiclesPage,
        pageCount: vehiclesPageCount,
        nextPage: nextVehiclesPage,
        prevPage: prevVehiclesPage,
        setPage: setVehiclesPage,
        canNextPage: canNextVehiclesPage,
        canPrevPage: canPrevVehiclesPage,
    } = usePagination(vehicles, 5);

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
                        <Button variant="outline" onClick={openCreateBrand}>Add Brand</Button>
                        <Button variant="outline" onClick={openCreateClass}>Add Class</Button>
                    </div>

                </div>

                {/* Brands and Classes lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                        <div className="bg-background rounded-lg shadow border p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">Brands</h2>
                        </div>
                        <ul className="divide-y">
                            {paginatedBrands.map((b) => (
                                <li key={b.id} className="flex items-center justify-between h-10">
                                    <span>{b.name}</span>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditBrand(b)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => deleteBrand(b)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                            {Array.from({ length: Math.max(0, 5 - paginatedBrands.length) }).map((_, idx) => (
                                <li key={`empty-${idx}`} className="h-10" aria-hidden="true" role="presentation" />
                            ))}
                        </ul>
                        </div>
                        {/* Pagination controls for Brands (outside the card/list, always shown) */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <Button variant="outline" size="sm" onClick={prevBrandsPage} disabled={!canPrevBrandsPage}>
                                Prev
                            </Button>
                            {Array.from({ length: Math.max(1, brandsPageCount) }, (_, i) => i + 1).map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === brandsPage ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBrandsPage(pageNum)}
                                    disabled={brandsPageCount === 0 || pageNum > brandsPageCount}
                                >
                                    {pageNum}
                                </Button>
                            ))}
                            <Button variant="outline" size="sm" onClick={nextBrandsPage} disabled={!canNextBrandsPage}>
                                Next
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="bg-background rounded-lg shadow border p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">Vehicle Classes</h2>
                        </div>
                        <ul className="divide-y">
                            {paginatedClasses.map((c) => (
                                <li key={c.id} className="flex items-center justify-between h-10">
                                    <span>{c.name}</span>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditClass(c)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => deleteClass(c)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                            {Array.from({ length: Math.max(0, 5 - paginatedClasses.length) }).map((_, idx) => (
                                <li key={`empty-class-${idx}`} className="h-10" aria-hidden="true" role="presentation" />
                            ))}
                        </ul>
                        </div>
                        {/* Pagination controls for Classes (outside card/list, always shown) */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <Button variant="outline" size="sm" onClick={prevClassesPage} disabled={!canPrevClassesPage}>
                                Prev
                            </Button>
                            {Array.from({ length: Math.max(1, classesPageCount) }, (_, i) => i + 1).map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === classesPage ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setClassesPage(pageNum)}
                                    disabled={classesPageCount === 0 || pageNum > classesPageCount}
                                >
                                    {pageNum}
                                </Button>
                            ))}
                            <Button variant="outline" size="sm" onClick={nextClassesPage} disabled={!canNextClassesPage}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mt-6 mb-2">Vehicle</h1>
                {/* Vehicle Table */}
                <div className="bg-background rounded-lg shadow overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brand</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Plate No.</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Seats</TableHead>
                                <TableHead>Transmission</TableHead>
                                <TableHead>Engine Spec</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedVehicles.map((vehicle) => (
                                <TableRow key={vehicle.id} className="h-12">
                                    <TableCell>{vehicle.brand}</TableCell>
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell>{vehicle.production_year}</TableCell>
                                    <TableCell>{vehicle.plate_no}</TableCell>
                                    <TableCell>{vehicle.vehicle_type}</TableCell>
                                    <TableCell>{vehicle.vehicle_class}</TableCell>
                                    <TableCell>{vehicle.seat_count}</TableCell>
                                    <TableCell>{vehicle.transmission}</TableCell>
                                    <TableCell>{vehicle.engine_spec}</TableCell>
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
                                                onClick={() => openImagesDialog(vehicle)}
                                            >
                                                <ImageIcon className="h-4 w-4" />
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
                            ))}
                            {Array.from({ length: Math.max(0, 5 - paginatedVehicles.length) }).map((_, idx) => (
                                <TableRow key={`vehicle-empty-${idx}`} className="h-12" aria-hidden="true" role="presentation">
                                    {Array.from({ length: 11 }).map((__, cellIdx) => (
                                        <TableCell key={cellIdx} />
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination controls for Vehicles (outside the table container, always shown) */}
                <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={prevVehiclesPage} disabled={!canPrevVehiclesPage}>
                        Prev
                    </Button>
                    {Array.from({ length: Math.max(1, vehiclesPageCount) }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                            key={pageNum}
                            variant={pageNum === vehiclesPage ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setVehiclesPage(pageNum)}
                            disabled={vehiclesPageCount === 0 || pageNum > vehiclesPageCount}
                        >
                            {pageNum}
                        </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={nextVehiclesPage} disabled={!canNextVehiclesPage}>
                        Next
                    </Button>
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

                                {/* Seats */}
                                <div className="space-y-2">
                                    <Label htmlFor="seat_count">Seats</Label>
                                    <Input
                                        id="seat_count"
                                        name="seat_count"
                                        type="number"
                                        value={data.seat_count}
                                        onChange={handleChange}
                                    />
                                    {errors.seat_count && (
                                        <p className="text-red-500 text-sm">{errors.seat_count}</p>
                                    )}
                                </div>

                                {/* Transmission */}
                                <div className="space-y-2">
                                    <Label htmlFor="transmission">Transmission</Label>
                                    <Select
                                        name="transmission"
                                        value={data.transmission}
                                        onValueChange={(value) => handleSelectChange('transmission', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select transmission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="manual">Manual</SelectItem>
                                            <SelectItem value="automatic">Automatic</SelectItem>
                                            <SelectItem value="semi-automatic">Semi-automatic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.transmission && (
                                        <p className="text-red-500 text-sm">{errors.transmission}</p>
                                    )}
                                </div>

                                {/* Engine Spec */}
                                <div className="space-y-2">
                                    <Label htmlFor="engine_spec">Engine Spec</Label>
                                    <Input
                                        id="engine_spec"
                                        name="engine_spec"
                                        value={data.engine_spec}
                                        onChange={handleChange}
                                    />
                                    {errors.engine_spec && (
                                        <p className="text-red-500 text-sm">{errors.engine_spec}</p>
                                    )}
                                </div>

                                {/* Vehicle Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                                    <Select
                                        name="vehicle_type"
                                        value={data.vehicle_type}
                                        onValueChange={(value) => handleSelectChange('vehicle_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select vehicle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="car">Car</SelectItem>
                                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.vehicle_type && (
                                        <p className="text-red-500 text-sm">{errors.vehicle_type}</p>
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

                {/* Brand Create/Edit Dialog */}
                <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="brand_name">Name</Label>
                                <Input id="brand_name" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsBrandDialogOpen(false)}>Cancel</Button>
                                <Button onClick={submitBrand} disabled={brandProcessing}>{editingBrand ? 'Update' : 'Create'}</Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Vehicle Class Create/Edit Dialog */}
                <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingClass ? 'Edit Class' : 'Add Class'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="class_name">Name</Label>
                                <Input id="class_name" value={className} onChange={(e) => setClassName(e.target.value)} />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsClassDialogOpen(false)}>Cancel</Button>
                                <Button onClick={submitClass} disabled={classProcessing}>{editingClass ? 'Update' : 'Create'}</Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Images Management Dialog */}
                <Dialog open={isImagesDialogOpen} onOpenChange={setIsImagesDialogOpen}>
                    <DialogContent className="max-w-5xl md:max-w-[900px]">
                        <DialogHeader>
                            <DialogTitle>Manage Images{imagesVehicle ? ` — ${imagesVehicle.brand} ${imagesVehicle.model}` : ''}</DialogTitle>
                        </DialogHeader>

                        {imagesError && <div className="text-red-600 text-sm">{imagesError}</div>}

                        {/* Primary image */}
                        <section className="border rounded p-6 space-y-4">
                            <h2 className="font-medium">Primary Image</h2>
                            <div className="flex items-start gap-6">
                                <div className="w-64 h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                                    {imagesVehicle?.image_url ? (
                                        <img src={imagesVehicle.image_url} alt={imagesVehicle.primary_image_alt || ''} className="object-cover w-full h-full" />
                                    ) : (
                                        <span className="text-gray-400 text-sm">No primary image</span>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setPrimaryFile(e.target.files?.[0]||null)} />
                                    <input type="text" placeholder="Alt text (optional)" value={primaryAlt} onChange={e=>setPrimaryAlt(e.target.value)} className="border rounded px-2 py-1 w-80" />
                                    <div className="flex gap-2">
                                        <Button onClick={uploadPrimary} disabled={imagesBusy||!primaryFile}>Upload/Replace</Button>
                                        <Button variant="destructive" onClick={deletePrimary} disabled={imagesBusy||!imagesVehicle?.image_url}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Secondary images */}
                        <section className="border rounded p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-medium">Secondary Images</h2>
                                <div className="text-sm text-gray-500">{secImages.length}/{maxSecondary} used</div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>setUploadFiles(Array.from(e.target.files||[]))} />
                                <Button onClick={uploadSecondary} disabled={imagesBusy || uploadFiles.length===0 || (maxSecondary - secImages.length) <= 0}>Upload</Button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Button onClick={saveReorder} disabled={imagesBusy} variant="secondary">Save Reorder</Button>
                                    <span className="text-xs text-gray-500">Positions must be unique and 0–9.</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {secImages.map(img => (
                                        <div key={img.id} className="border rounded p-2 space-y-2">
                                            <div className="w-full h-36 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                                <img src={img.url} alt={img.alt_text || ''} className="object-cover w-full h-full" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-gray-600">Pos</label>
                                                <input type="number" min={0} max={9} value={img.position} onChange={e=>{
                                                    const val = parseInt(e.target.value, 10);
                                                    setSecImages(prev => prev.map(i => i.id===img.id ? { ...i, position: val } : i));
                                                }} className="border rounded px-2 py-1 w-16" />
                                            </div>
                                            <input type="text" placeholder="Alt text" defaultValue={img.alt_text||''} onBlur={e=>saveAlt(img.id, e.currentTarget.value)} className="border rounded px-2 py-1 w-full" />
                                            <div className="flex gap-2">
                                                <Button onClick={()=>promoteSecondary(img.id)} disabled={imagesBusy} variant="secondary">Set as Primary</Button>
                                                <Button onClick={()=>deleteSecondary(img.id)} disabled={imagesBusy} variant="destructive">Delete</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {imagesBusy && <div className="text-sm text-gray-500">Working...</div>}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}