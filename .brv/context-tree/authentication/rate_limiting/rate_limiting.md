
Rate limiting is configured for login attempts. It allows 5 requests per minute per IP address and phone number combination.

---

'''php
// app/Providers/FortifyServiceProvider.php

private function configureRateLimiting(): void
{
    RateLimiter::for('login', function (Request $request) {
        $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

        return Limit::perMinute(5)->by($throttleKey);
    });
}
'''
