import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AppShell } from '@/components/app-shell';
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
import { cn, resolveUrl } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {

    Bell,
    ChevronDown,
    LayoutDashboard,
    Settings,
    ShieldCheck,
    Users,
    ShoppingCart,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { dashboard as adminDashboard } from '@/routes/admin';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
}

const adminNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: adminDashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Vehicle Management',
        href: '/admin/vehicle-management',
        icon: ShieldCheck,
    },
    {
        title: 'User Management',
        href: '/admin/user-management',
        icon: Users,
    },

    {
        title: 'Order',
        href: '#',
        icon: ShoppingCart,
        children: [
            {
                title: 'Approval',
                href: '/admin/order/Approval',
            },
            {
                title: 'Order History',
                href: '/admin/order/orderHistory',
            },
        ],
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

export default function AdminLayout({
    children,
    title = 'Overview',
    description = 'Key metrics and signals for your platform.',
    breadcrumbs = [
        {
            title: 'Admin',
            href: adminDashboard().url,
        },
        {
            title,
            href: adminDashboard().url,
        },
    ],
    actions,
}: AdminLayoutProps) {
    const defaultActions =
        actions ??
        (
            <Button size="sm" className="hidden sm:inline-flex">
                Export Report
            </Button>
        );

    return (
        <AppShell variant="sidebar">
            <AdminSidebar />
            <SidebarInset className="bg-background">
                <AdminHeader
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

function AdminHeader({
    title,
    description,
    breadcrumbs,
    actions,
}: Required<Pick<AdminLayoutProps, 'title' | 'description' | 'breadcrumbs'>> & {
    actions: ReactNode;
}) {
    const { props } = usePage<SharedData>();
    const adminName = props.auth?.admin?.name ?? 'Admin';

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
                        Welcome back, {adminName}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>Last synced 3 minutes ago</span>
                </div>
            </div>
        </header>
    );
}

function AdminSidebar() {
    const page = usePage();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={adminDashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-4">
                <SidebarMenu>
                    {adminNavItems.map((item) => {


                        const isOpen = openDropdown === item.title;
                        
                        return (
                            <SidebarMenuItem key={item.title}>
                                {item.children ? (
                                    <>
                                        <SidebarMenuButton
                                            isActive={page.url.startsWith(resolveUrl(item.children[0]?.href || ''))}
                                            tooltip={{
                                                children: item.title,
                                            }}
                                            onClick={() => setOpenDropdown(isOpen ? null : item.title)}
                                            className="cursor-pointer"
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronDown className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </SidebarMenuButton>
                                        
                                        {isOpen && (
                                            <SidebarMenu className="ml-4">
                                                {item.children.map((child) => (
                                                    <SidebarMenuItem key={child.title}>
                                                        <SidebarMenuButton
                                                            asChild
                                                            isActive={page.url.startsWith(
                                                                resolveUrl(child.href),
                                                            )}
                                                            tooltip={{
                                                                children: child.title,
                                                            }}
                                                        >
                                                            <Link href={child.href}>
                                                                <span>{child.title}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                ))}
                                            </SidebarMenu>
                                        )}
                                    </>
                                ) : (
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.startsWith(
                                            resolveUrl(item.href),
                                        )}
                                        tooltip={{
                                            children: item.title,
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            prefetch={
                                                typeof item.href === 'string'
                                                    ? false
                                                    : true
                                            }
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link
                                className={cn(
                                    'border border-dashed border-sidebar-border/60',
                                )}
                                href={`${adminDashboard().url}#reports`}
                                prefetch={false}
                            >
                                <LayoutDashboard className="size-4" />
                                <span>Create report</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
