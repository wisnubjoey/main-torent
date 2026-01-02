import AdminLayout from '@/layouts/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
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
import { router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function OrderHistoryPage() {
    const { orders, filters, stats } = usePage().props as {
        orders?: { data?: unknown[]; links?: unknown[] } & unknown[];
        filters?: {
            date_from?: string;
            date_to?: string;
            user?: string;
            status?: string;
            vehicle_count_min?: string;
            vehicle_count_max?: string;
        };
        stats?: {
            total_orders?: number;
            completed_orders?: number;
            cancelled_orders?: number;
        };
    };
    const [localFilters, setLocalFilters] = useState({
        date_from: filters?.date_from ?? '',
        date_to: filters?.date_to ?? '',
        user: filters?.user ?? '',
        status: filters?.status ?? '',
        vehicle_count_min: filters?.vehicle_count_min ?? '',
        vehicle_count_max: filters?.vehicle_count_max ?? '',
    });

    useEffect(() => {
        if (filters) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalFilters({
                date_from: filters.date_from ?? '',
                date_to: filters.date_to ?? '',
                user: filters.user ?? '',
                status: filters.status ?? '',
                vehicle_count_min: filters.vehicle_count_min ?? '',
                vehicle_count_max: filters.vehicle_count_max ?? '',
            });
        }
    }, [filters]);

    const list = useMemo(() => (orders?.data ?? orders ?? []), [orders]);

    const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(v);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const submitFilters = () => {
        const params: Record<string, string> = {};
        Object.entries(localFilters).forEach(([k, v]) => {
            if (String(v).length) params[k] = String(v);
        });
        router.get('/admin/order/orderHistory', params, { preserveScroll: true, preserveState: true });
    };

    return (
        <AdminLayout title="Order History" description="Filter and view completed and cancelled orders.">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-1">
                        <Input
                            placeholder="Date from (YYYY-MM-DD)"
                            value={localFilters.date_from}
                            onChange={(e) => setLocalFilters({ ...localFilters, date_from: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <Input
                            placeholder="Date to (YYYY-MM-DD)"
                            value={localFilters.date_to}
                            onChange={(e) => setLocalFilters({ ...localFilters, date_to: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <Input
                            placeholder="User name or phone"
                            value={localFilters.user}
                            onChange={(e) => setLocalFilters({ ...localFilters, user: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <Select
                            value={localFilters.status || ''}
                            onValueChange={(v) => setLocalFilters({ ...localFilters, status: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-1 flex gap-2">
                        <Input
                            type="number"
                            placeholder="Min vehicles"
                            value={localFilters.vehicle_count_min}
                            onChange={(e) => setLocalFilters({ ...localFilters, vehicle_count_min: e.target.value })}
                        />
                        <Input
                            type="number"
                            placeholder="Max"
                            value={localFilters.vehicle_count_max}
                            onChange={(e) => setLocalFilters({ ...localFilters, vehicle_count_max: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Total: {stats?.total_orders ?? 0} • Completed: {stats?.completed_orders ?? 0} • Cancelled: {stats?.cancelled_orders ?? 0}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setLocalFilters({ date_from: '', date_to: '', user: '', status: '', vehicle_count_min: '', vehicle_count_max: '' })}>Reset</Button>
                        <Button onClick={submitFilters}>Apply Filters</Button>
                    </div>
                </div>

                <div className="bg-background rounded-lg shadow overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Vehicles</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.map((order: unknown) => {
                                const o = order as {
                                    id: number;
                                    user?: { name?: string; phone?: string };
                                    vehicle_count: number;
                                    period: string;
                                    total_price_idr: number;
                                    status: string;
                                };
                                return (
                                    <TableRow key={o.id} className="h-16">
                                        <TableCell className="font-medium">{o.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{o.user?.name}</p>
                                                <p className="text-sm text-muted-foreground">{o.user?.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{o.vehicle_count}</TableCell>
                                        <TableCell>{o.period}</TableCell>
                                        <TableCell>{formatIDR(o.total_price_idr)}</TableCell>
                                        <TableCell>{getStatusBadge(o.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2"></div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {orders?.links && (
                    <div className="flex flex-wrap items-center gap-2">
                        {orders.links.map((l: unknown, idx: number) => {
                            const link = l as { url?: string; active?: boolean; label: string };
                            return (
                                <Button
                                    key={idx}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                    disabled={!link.url}
                                >
                                    {link.label.replace(/&laquo;|&raquo;/g, '')}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

