
The application uses custom views for Fortify, which are rendered using Inertia.js.

---

'''php
// app/Providers/FortifyServiceProvider.php

private function configureViews(): void
{
    Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
        'canResetPassword' => false,
        'canRegister' => Features::enabled(Features::registration()),
        'status' => $request->session()->get('status'),
    ]));

    Fortify::registerView(fn () => Inertia::render('auth/register'));

    Fortify::confirmPasswordView(fn () => Inertia::render('user/auth/confirm-password'));
}
'''
