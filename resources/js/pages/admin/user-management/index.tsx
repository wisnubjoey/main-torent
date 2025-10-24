import AdminLayout from '@/layouts/admin/AdminLayout';
import { dashboard as adminDashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: adminDashboard().url,
    },
    {
        title: 'User Management',
        href: '/admin/user-management',
    },
];

export default function UserManagement() {
    return (
        <AdminLayout
            title="User Management"
            description="Manage users and their permissions"
            breadcrumbs={breadcrumbs}
        >
            <Head title="User Management" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="mt-2">Hello World! This is the user management page.</p>
            </div>
        </AdminLayout>
    );
}