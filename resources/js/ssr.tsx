import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { CartProvider } from './context/cart-context';
import type { CartItem } from './context/cart-context';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            const initialCart = (props as { initialPage?: { props?: { cart?: Record<number, CartItem> } } }).initialPage?.props?.cart ?? {};
            return (
                <CartProvider initialCart={initialCart}>
                    <App {...props} />
                </CartProvider>
            );
        },
    }),
);
