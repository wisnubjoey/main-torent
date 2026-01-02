
## Relations
@@structure/inertia_ssr

The application has dual entry points for client-side rendering (`app.tsx`) and server-side rendering (`ssr.tsx`). The `HandleInertiaRequests` middleware shares common data with the frontend, including authentication status and the rental cart.

---

'''php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        // ...
        'auth' => [
            'user' => $request->user(),
            'admin' => Auth::guard('admin')->user(),
        ],
        'cart' => Session::get('rental_cart', []),
        // ...
    ];
}
'''

---

'''typescript
// resources/js/app.tsx
createInertiaApp({
    // ...
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <CartProvider initialCart={(props as any)?.initialPage?.props?.cart ?? {}}>
                <App {...props} />
            </CartProvider>
        );
    },
    // ...
});
'''
