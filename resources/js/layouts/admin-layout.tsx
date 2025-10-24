import { type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function AdminLayout({
    children,
    title = 'Admin Console',
    description,
}: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-6">
            <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-background p-8 shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {description ? (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    ) : null}
                </div>
                {children}
            </div>
        </div>
    );
}
