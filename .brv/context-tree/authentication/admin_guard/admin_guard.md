
A separate 'admin' guard is used for the admin panel. This guard is used in conjunction with the 'web' guard for regular users.

---

'''php
// app/Http/Middleware/EnsureAdmin.php

$guard = Auth::guard('admin');
'''
