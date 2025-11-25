import AdminLayout from '@/layouts/admin/AdminLayout';

export default function ApprovalPage() {
    return (
        <AdminLayout title="Order Approval" description="Manage and approve rental orders.">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Order Approval</h1>
                <p className="text-gray-600">This page will show pending and ongoing rental orders for approval.</p>
            </div>
        </AdminLayout>
    );
}

