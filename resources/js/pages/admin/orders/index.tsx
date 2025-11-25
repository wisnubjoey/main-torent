import AdminLayout from '@/layouts/admin/AdminLayout';

export default function OrdersPage() {
    return (
        <AdminLayout title="Orders" description="Manage rental orders.">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Orders</h1>
                <p className="text-gray-600">This is the orders overview page.</p>
            </div>
        </AdminLayout>
    );
}
