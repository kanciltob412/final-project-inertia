import { Head, Link, useForm } from '@inertiajs/react';
import CustomerLayout from '@/layouts/customer-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, put, errors, processing, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <CustomerLayout title="Change Password">
            <Head title="Change Password" />
            <div className="space-y-6 p-4 md:p-8 max-w-2xl mx-auto">
                {/* Back Link */}
                <Link href="/customer/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mb-6">
                    <span>←</span>
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                        <Lock className="h-8 w-8" />
                        Change Password
                    </h1>
                    <p className="text-gray-600">Update your password to keep your account secure</p>
                </div>

                {/* Password Change Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <Label htmlFor="current_password" className="mb-2 block">
                                    Current Password *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="current_password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        placeholder="Enter your current password"
                                        autoComplete="current-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.current_password} className="mt-2" />
                            </div>

                            {/* New Password */}
                            <div>
                                <Label htmlFor="password" className="mb-2 block">
                                    New Password *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter a strong new password"
                                        autoComplete="new-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Password must be at least 8 characters and include uppercase, lowercase, and numbers
                                </p>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <Label htmlFor="password_confirmation" className="mb-2 block">
                                    Confirm New Password *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm your new password"
                                        autoComplete="new-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Password'}
                                </Button>
                                {recentlySuccessful && (
                                    <p className="text-sm font-medium text-green-600">✓ Password updated successfully!</p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Security Tips */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-base">Password Security Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• Use a unique password that you don't use on other websites</li>
                            <li>• Include uppercase letters, lowercase letters, numbers, and symbols</li>
                            <li>• Make your password at least 12 characters long</li>
                            <li>• Don't share your password with anyone</li>
                            <li>• Change your password regularly (we recommend every 3-6 months)</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </CustomerLayout>
    );
}
