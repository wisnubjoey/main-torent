
## Relations
@authentication/admin-guard

The `EnsureAdmin` middleware is used to protect admin routes. It checks if the authenticated user has the `is_admin` flag set to true. If not, the user is logged out and redirected to the admin login page.

---

'''php
// app/Http/Middleware/EnsureAdmin.php

public function handle(Request $request, Closure $next): Response
{
    $guard = Auth::guard('admin');

    if ($guard->check()) {
        if ($guard->user()?->is_admin) {
            return $next($request);
        }

        $guard->logout();
    }

    if ($request->expectsJson()) {
        abort(Response::HTTP_FORBIDDEN);
    }

    return redirect()->route('admin.login');
}
'''
