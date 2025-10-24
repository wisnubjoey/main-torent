import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin/AdminLayout';
import { dashboard as adminDashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle,
    Clock,
    LineChart,
    ShieldCheck,
    UserPlus,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: adminDashboard().url,
    },
    {
        title: 'Overview',
        href: adminDashboard().url,
    },
];

const statTiles = [
    {
        label: 'Monthly Recurring Revenue',
        value: '$84.2k',
        change: '+12.4%',
        trend: 'up' as const,
        helper: 'vs last month',
    },
    {
        label: 'Active Subscribers',
        value: '2,431',
        change: '+3.2%',
        trend: 'up' as const,
        helper: 'net of churn',
    },
    {
        label: 'Support Backlog',
        value: '38',
        change: '-18%',
        trend: 'down' as const,
        helper: 'resolved in 24h',
    },
    {
        label: 'Net Promoter Score',
        value: '52',
        change: '+4 pts',
        trend: 'up' as const,
        helper: 'steady growth',
    },
];

const recentActivity = [
    {
        title: 'Enterprise upgrade completed',
        description: 'Acme Industries switched to Enterprise plan',
        timestamp: '5 minutes ago',
        icon: CheckCircle,
    },
    {
        title: 'New admin invited',
        description: 'Taylor Reid added with billing permissions',
        timestamp: '12 minutes ago',
        icon: UserPlus,
    },
    {
        title: 'Potential fraud alert',
        description: 'Unusual sign-in attempt flagged in EU region',
        timestamp: '27 minutes ago',
        icon: AlertTriangle,
    },
    {
        title: 'Security review passed',
        description: 'Quarterly controls assessment completed',
        timestamp: '1 hour ago',
        icon: ShieldCheck,
    },
];

const systemHealth = [
    {
        label: 'API uptime',
        value: '99.98%',
        status: 'Nominal',
    },
    {
        label: 'Job queue latency',
        value: '420ms',
        status: 'Monitoring',
    },
    {
        label: 'Webhook success',
        value: '97.4%',
        status: 'Improving',
    },
];

export default function AdminDashboard() {
    const layoutActions = (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                Schedule sync
            </Button>
            <Button size="sm">New insight</Button>
        </div>
    );

    return (
        <AdminLayout
            title="Overview"
            description="Track customer growth, platform health, and revenue momentum at a glance."
            breadcrumbs={breadcrumbs}
            actions={layoutActions}
        >
            <Head title="Admin Dashboard" />
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statTiles.map((stat) => (
                    <Card
                        key={stat.label}
                        className="border border-sidebar-border/60 dark:border-sidebar-border"
                    >
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                                <div className="mt-2 text-2xl font-semibold tracking-tight">
                                    {stat.value}
                                </div>
                            </div>
                            <Badge
                                variant={
                                    stat.trend === 'down' ? 'outline' : 'default'
                                }
                                className={
                                    stat.trend === 'down'
                                        ? 'text-destructive'
                                        : ''
                                }
                            >
                                {stat.trend === 'down' ? (
                                    <ArrowDownRight className="size-3" />
                                ) : (
                                    <ArrowUpRight className="size-3" />
                                )}
                                {stat.change}
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground">
                                {stat.helper}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
                <Card className="border border-sidebar-border/60 dark:border-sidebar-border">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div>
                            <CardTitle>Revenue trend</CardTitle>
                            <CardDescription>
                                Rolling 6-week snapshot of MRR and churn
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                            <LineChart className="size-3" />
                            Updated 2m ago
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="relative h-64 overflow-hidden rounded-xl border border-dashed border-sidebar-border/70 bg-muted/40 dark:border-sidebar-border/80">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                            <div className="absolute inset-x-8 bottom-8 flex items-end gap-3">
                                {[25, 45, 38, 62, 58, 76].map(
                                    (height, index) => (
                                        <div
                                            key={index}
                                            className="flex w-full items-end gap-1"
                                        >
                                            <div
                                                className="h-28 w-full rounded-md bg-primary/80 transition-all"
                                                style={{
                                                    height: `${height + 30}px`,
                                                }}
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <div className="text-sm text-muted-foreground">
                            Forecast projects +15% growth by end of quarter.
                        </div>
                        <Button variant="ghost" size="sm">
                            View report
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="border border-sidebar-border/60 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle>System health</CardTitle>
                        <CardDescription>
                            Operational signals across core services
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {systemHealth.map((item) => (
                            <div key={item.label} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm font-medium">
                                    <span>{item.label}</span>
                                    <span>{item.value}</span>
                                </div>
                                <Separator className="bg-border/70" />
                                <p className="text-xs text-muted-foreground">
                                    Status: {item.status}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="size-4 text-emerald-500" />
                            Guardrails enabled
                        </div>
                        <Button variant="outline" size="sm">
                            Audit logs
                        </Button>
                    </CardFooter>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <Card className="border border-sidebar-border/60 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle>Recent activity</CardTitle>
                        <CardDescription>
                            Latest admin actions and automated alerts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.title} className="space-y-1.5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-md border border-sidebar-border/60 bg-background">
                                            <activity.icon className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-tight">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.description}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {activity.timestamp}
                                    </span>
                                </div>
                                <Separator className="bg-border/70" />
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="size-4" />
                            Live since 4:05 PM
                        </div>
                        <Button variant="ghost" size="sm">
                            View all activity
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="border border-sidebar-border/60 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle>Escalations queue</CardTitle>
                        <CardDescription>
                            Action items requiring admin oversight
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 rounded-lg border border-dashed border-sidebar-border/60 p-4">
                            <AlertTriangle className="mt-0.5 size-5 text-amber-500" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-tight">
                                    Payment processor alert
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Elevated failure rate for EU customers. Verify routing rules.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-dashed border-sidebar-border/60 p-4">
                            <UserPlus className="mt-0.5 size-5 text-primary" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-tight">
                                    Pending enterprise invite
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Approve new admin access request from Crescent Holdings.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <div className="text-xs text-muted-foreground">
                            2 of 7 escalations completed today
                        </div>
                        <Button size="sm">Review queue</Button>
                    </CardFooter>
                </Card>
            </section>
        </AdminLayout>
    );
}