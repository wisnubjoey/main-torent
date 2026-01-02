
The application uses Laravel Fortify for authentication. The username is configured to be the 'phone' field instead of the default 'email'.

---

'''php
// app/Providers/FortifyServiceProvider.php

private function configureActions(): void
{
    Fortify::username('phone');
    Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
    Fortify::createUsersUsing(CreateNewUser::class);
}
'''
