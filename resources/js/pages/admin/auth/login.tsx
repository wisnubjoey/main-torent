import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import adminLogin from '@/routes/admin/login';
import { Head, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

interface AdminLoginProps {
    status?: string;
}

export default function AdminLogin({ status }: AdminLoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(adminLogin.store.url(), {
            onSuccess: () => {
                reset('password');
            },
        });
    };

    return (
        <AuthLayout
            title="Admin sign in"
            description="Use your admin phone number and password to access the console"
        >
            <Head title="Admin Login" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            name="phone"
                            required
                            autoFocus
                            autoComplete="tel"
                            placeholder="555 000 0000"
                            value={data.phone}
                            onChange={(event) => setData('phone', event.target.value)}
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                            autoComplete="current-password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) =>
                                setData('remember', checked === true)
                            }
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        {processing && <Spinner />}
                        Log in
                    </Button>
                </div>
            </form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
