import AdminLayout from '@/layouts/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { router, usePage } from '@inertiajs/react';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ApprovalPage() {
    const { orders } = usePage().props as any;
    const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!orders || orders.length === 0) {
        return (
            <AdminLayout title="Order Approval" description="Manage and approve rental orders.">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Order Approval</h1>
                    <div className="relative h-96 rounded-xl border border-dashed border-sidebar-border/70 bg-muted/40 overflow-hidden">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                            <div className="text-center">
                                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No orders pending approval</h3>
                                <p className="text-muted-foreground">All rental orders are currently processed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const handleStart = (orderId: number) => {
        setIsProcessing(true);
        router.post(`/admin/orders/${orderId}/start`, {}, {
            onSuccess: () => {
                toast.success('Rental started successfully');
                router.reload();
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string || 'Failed to start rental');
            },
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleComplete = (orderId: number) => {
        setIsProcessing(true);
        router.post(`/admin/orders/${orderId}/complete`, {}, {
            onSuccess: () => {
                toast.success('Rental completed successfully');
                router.reload();
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string || 'Failed to complete rental');
            },
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleCancel = (orderId: number) => {
        setIsProcessing(true);
        router.post(`/admin/orders/${orderId}/cancel`, {}, {
            onSuccess: () => {
                toast.success('Order cancelled successfully');
                router.reload();
                setOrderToCancel(null);
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string || 'Failed to cancel order');
            },
            onFinish: () => setIsProcessing(false)
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
            case 'ongoing':
                return <Badge className="bg-blue-100 text-blue-800">Ongoing</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AdminLayout title="Order Approval" description="Manage and approve rental orders.">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Order Approval</h1>
                <div className="bg-background rounded-lg shadow overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Vehicle Count</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order: any) => (
                                <TableRow key={order.id} className="h-16">
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.user?.name}</p>
                                            <p className="text-sm text-muted-foreground">{order.user?.phone}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.vehicle_count}</TableCell>
                                    <TableCell>{order.period}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(order.total_price_idr)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(order.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            {order.status === 'draft' && (
                                                <Button 
                                                    variant="default" 
                                                    size="sm" 
                                                    onClick={() => handleStart(order.id)}
                                                    disabled={isProcessing}
                                                    title="Start Rental"
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {order.status === 'ongoing' && (
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => handleComplete(order.id)}
                                                    disabled={isProcessing}
                                                    title="Complete Rental"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {(order.status === 'draft' || order.status === 'ongoing') && (
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    onClick={() => setOrderToCancel(order.id)}
                                                    disabled={isProcessing}
                                                    title="Cancel Order"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <AlertDialog open={orderToCancel !== null} onOpenChange={() => setOrderToCancel(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to cancel this order? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => {
                                    if (orderToCancel) {
                                        handleCancel(orderToCancel);
                                    }
                                }}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Cancelling...' : 'Confirm Cancel'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}

