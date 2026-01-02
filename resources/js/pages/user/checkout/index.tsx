import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Head, router } from '@inertiajs/react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/components/cart-item';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Checkout', href: '/checkout' },
];

export default function CheckoutPage() {
  const { getCartItems, getCartTotal } = useCart();
  const items = getCartItems();
  const total = getCartTotal();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

  const submitOrder = () => {
    setIsSubmitting(true);
    router.post('/rental-cart/checkout', { notes }, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Checkout" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Review Your Cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <div className="text-muted-foreground">Your cart is empty.</div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.vehicle_id} itemId={item.vehicle_id} />
                ))}
                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">{formatIDR(total)}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <Input
                    placeholder="Any specific request or information"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={submitOrder} disabled={isSubmitting || items.length === 0}>
                    {isSubmitting ? 'Submitting...' : 'Apply Order'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

