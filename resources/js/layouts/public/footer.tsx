import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Car, ShieldCheck } from 'lucide-react';

export default function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn('border-t bg-muted/40', className)}>
            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-3">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                        <Car className="size-5 text-primary" /> Voyage Rentals
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        Premium vehicle rentals with concierge-grade service and trusted partners worldwide.
                    </p>
                    <div className="flex gap-3">
                        <Badge variant="outline" className="px-3 py-1 text-xs">
                            <ShieldCheck className="mr-1 size-3" /> Secured by Stripe & PayPal
                        </Badge>
                    </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                    <h3 className="text-base font-semibold text-foreground">Company</h3>
                    <Link href="/about">About</Link>
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/help-center">Help Center</Link>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                    <h3 className="text-base font-semibold text-foreground">Stay Connected</h3>
                    <Link href="https://instagram.com" target="_blank" rel="noreferrer">
                        Instagram
                    </Link>
                    <Link href="https://facebook.com" target="_blank" rel="noreferrer">
                        Facebook
                    </Link>
                    <Link href="https://tiktok.com" target="_blank" rel="noreferrer">
                        TikTok
                    </Link>
                    <Link href="https://youtube.com" target="_blank" rel="noreferrer">
                        YouTube
                    </Link>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                    <h3 className="text-base font-semibold text-foreground">Legal & Registered</h3>
                    <p>Voyage Mobility Group Pte. Ltd.</p>
                    <p>UEN: 202412345Z</p>
                    <p>Registered office: 88 Marina View, Singapore 018967</p>
                    <p className="text-xs">© {new Date().getFullYear()} Voyage Rentals. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}