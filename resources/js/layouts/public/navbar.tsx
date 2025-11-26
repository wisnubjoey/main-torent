import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { Car } from 'lucide-react';

export default function Navbar({ className }: { className?: string }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className={cn('border-b bg-background/70 backdrop-blur', className)}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                    <Car className="size-5 text-primary" />
                    Voyage Rentals
                </Link>
                <nav className="flex items-center gap-4 text-sm">
                    <Link href="/vehicles" className="text-muted-foreground transition hover:text-primary">
                        Vehicles
                    </Link>
                    {auth.user ? (
                        <Link href={dashboard()} className="text-muted-foreground transition hover:text-primary">
                            Dashboard
                        </Link>
                    ) : (
                        <Link href={login()} className="text-muted-foreground transition hover:text-primary">
                            Login
                        </Link>
                    )}
                    {/* Orders UI lives inside dashboard; keep public navbar minimal */}
                    <Button className="hidden sm:inline-flex" size="sm">
                        Book Concierge
                    </Button>
                </nav>
            </div>
        </header>
    );
}
