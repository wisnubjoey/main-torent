
Server-side rendering (SSR) is enabled and can be started with the `php artisan inertia:start-ssr` command. The `ssr.tsx` file is the entry point for the SSR server.

---

'''typescript
// resources/js/ssr.tsx

import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

// ... SSR setup ...

createServer((page) =>
    createInertiaApp({
        page,
        // ...
    }),
);
'''
