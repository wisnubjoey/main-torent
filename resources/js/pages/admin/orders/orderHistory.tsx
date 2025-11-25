import AdminLayout from '@/layouts/admin/AdminLayout';

export default function OrderHistoryPage() {
    return (
        <AdminLayout title="Order History" description="View completed and cancelled rental orders.">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Order History</h1>
                <p className="text-gray-600">This page will show the history of completed and cancelled rental orders.</p>
            </div>
        </AdminLayout>
    );
}
