import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { CartProvider } from './context/cart-context';
import type { CartItem } from './context/cart-context';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const initialCart = (props as { initialPage?: { props?: { cart?: Record<number, CartItem> } } }).initialPage?.props?.cart ?? {};

        root.render(
            <StrictMode>
                <CartProvider initialCart={initialCart}>
                    <App {...props} />
                    <Toaster position="top-right" richColors />
                </CartProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
