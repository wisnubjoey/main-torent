import AdminLayout from '@/layouts/admin-layout';
import admin from '@/routes/admin';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';

export default function AdminDashboard() {
    const handleLogout = () => {
        router.post(admin.logout.post().url);
    };

    return (
        <AdminLayout
            title="Admin Dashboard"
            description="You are signed in with elevated access."
        >
            <Head title="Admin Dashboard" />
            <Button className="w-full" onClick={handleLogout}>
                Log out
            </Button>
        </AdminLayout>
    );
}
