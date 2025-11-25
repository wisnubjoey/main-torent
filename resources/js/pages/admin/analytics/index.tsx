import AdminLayout from '@/layouts/admin/AdminLayout';

export default function AnalyticsPage() {
    return (
        <AdminLayout title="Analytics" description="View analytics and reports for your platform.">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Analytics</h1>
                <p className="text-gray-600">This page will show analytics and reports for the rental platform.</p>
            </div>
        </AdminLayout>
    );
}
