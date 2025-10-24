<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
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
}
