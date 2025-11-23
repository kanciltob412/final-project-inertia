import { Link, usePage, useForm } from '@inertiajs/react';
import { type SharedData } from '@/types';
import CustomerLayout from '@/layouts/customer-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { User, Lock } from 'lucide-react';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
    });

    const handleDeleteAccount = () => {
        if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone. All your data, orders, and settings will be permanently deleted.')) {
            if (window.confirm('This is your final warning. Click OK to permanently delete your account.')) {
                fetch('/customer/profile', {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                }).then(response => {
                    if (response.ok) {
                        // Redirect to home page after successful deletion
                        window.location.href = '/';
                    }
                }).catch(error => {
                    console.error('Error deleting account:', error);
                    alert('An error occurred while deleting your account. Please try again.');
                });
            }
        }
    };

    return (
        <CustomerLayout title="My Profile">

            <div className="space-y-6 p-4 md:p-8 max-w-4xl mx-auto">
                {/* Back Link */}
                <Link href="/customer/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mb-6">
                    <span>←</span>
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="text-gray-600">Manage your personal information and preferences</p>
                </div>

                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                patch('/customer/profile', {
                                    preserveScroll: true,
                                });
                            }}
                            className="space-y-6"
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Your full name"
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="your.email@example.com"
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                    <p className="text-sm text-yellow-900">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href="/verification-link/resend"
                                            as="button"
                                            className="font-semibold underline hover:text-yellow-700"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-4">
                                <Button disabled={processing} type="submit">
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>

                                {recentlySuccessful && (
                                    <p className="text-sm font-medium text-green-600">✓ Changes saved successfully!</p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Change Password Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-gray-600">
                            Update your password and manage your account security
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/customer/change-password">Change Password</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-900">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-red-800">
                            These actions are permanent and cannot be undone.
                        </p>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </CustomerLayout>
    );
}
