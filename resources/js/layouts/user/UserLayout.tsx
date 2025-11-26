import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AppShell } from '@/components/app-shell';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, LayoutGrid } from 'lucide-react';
import { type ReactNode } from 'react';

import { dashboard } from '@/routes';

interface UserLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
}

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Vehicles',
        href: '/dashboard/vehicles',
        icon: LayoutGrid,
    },
    {
        title: 'Cart',
        href: '/cart',
        icon: LayoutGrid,
    },
    {
        title: 'Checkout',
        href: '/checkout',
        icon: LayoutGrid,
    },
    {
        title: 'My Orders',
        href: '/orders',
        icon: LayoutGrid,
    },
    {
        title: 'Order History',
        href: '/orders/history',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: LayoutGrid,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: LayoutGrid,
    },
];

export default function UserLayout({
    children,
    title = 'Dashboard',
    description = 'Your activity and quick actions.',
    breadcrumbs = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title,
            href: dashboard().url,
        },
    ],
    actions,
}: UserLayoutProps) {
    const defaultActions =
        actions ?? (
            <Button size="sm" className="hidden sm:inline-flex">
                New Action
            </Button>
        );

    return (
        <AppShell variant="sidebar">
            <UserSidebar />
            <SidebarInset className="bg-background">
                <UserHeader
                    title={title}
                    description={description}
                    breadcrumbs={breadcrumbs}
                    actions={defaultActions}
                />
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                    {children}
                </div>
            </SidebarInset>
        </AppShell>
    );
}

function UserHeader({
    title,
    description,
    breadcrumbs,
    actions,
}: Required<Pick<UserLayoutProps, 'title' | 'description' | 'breadcrumbs'>> & {
    actions: ReactNode;
}) {
    const { props } = usePage<SharedData>();
    const userName = props.auth?.user?.name ?? 'User';

    return (
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col gap-4 px-4 py-4 md:px-6 md:py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold leading-tight tracking-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {actions}
                        <Button variant="outline" size="icon">
                            <Bell className="size-4" />
                            <span className="sr-only">Open notifications</span>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                        Welcome back, {userName}
                    </span>
                </div>
            </div>
        </header>
    );
}

function UserSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={userNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

