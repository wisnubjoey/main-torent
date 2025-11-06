import AdminLayout from '@/layouts/admin/AdminLayout';
import { dashboard as adminDashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Admin', href: adminDashboard().url },
  { title: 'Vehicle Class Management', href: '/admin/vehicle-class-management' },
];

interface VehicleClass { id: number; name: string }
interface Props { classes: VehicleClass[] }

export default function VehicleClassManagement({ classes: initial }: Props) {
  const [classes, setClasses] = useState<VehicleClass[]>(initial || []);
  const [name, setName] = useState('');
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState<VehicleClass | null>(null);

  const addClass = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/vehicle-class-management', { name }, {
      onSuccess: () => {
        setName('');
        setClasses([...classes, { id: Date.now(), name }]);
      },
    });
  };

  const confirmDelete = (c: VehicleClass) => { setCurrent(c); setDeleteOpen(true); };
  const handleDelete = () => {
    if (!current) return;
    router.delete(`/admin/vehicle-class-management/${current.id}`, {
      onSuccess: () => {
        setClasses(classes.filter(x => x.id !== current.id));
        setDeleteOpen(false);
        setCurrent(null);
      },
    });
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Vehicle Class Management" />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vehicle Class Management</h1>
        </div>

        <form onSubmit={addClass} className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="name">Class name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Class
            </Button>
          </div>
        </form>

        <div className="bg-background rounded-lg shadow overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4">No classes</TableCell>
                </TableRow>
              ) : (
                classes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => confirmDelete(c)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the class.
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