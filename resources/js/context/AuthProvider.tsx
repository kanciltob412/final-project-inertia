// AuthProviderInertia.tsx
import { router } from '@inertiajs/react';
import axios from 'axios';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface User {
    id: number;
    email: string;
    token: string;
}
interface AuthForm {
    email: string;
    password: string;
}
interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: () => Promise<void>;
    logout: () => void;
    form: AuthForm;
    setForm: React.Dispatch<React.SetStateAction<AuthForm>>;
}
interface AuthProviderProps {
    children: React.ReactNode;
    defaultRedirectPath?: string;
}

function getRedirectPathFromUrl(fallback = '/'): string {
    try {
        const url = new URL(window.location.href);
        return url.searchParams.get('redirect') || url.searchParams.get('next') || fallback;
    } catch {
        return fallback;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, defaultRedirectPath = '/' }) => {
    const initialUser = useMemo<User | null>(() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, []);

    const [user, setUser] = useState<User | null>(initialUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<AuthForm>({ email: '', password: '' });

    const login = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post<User>(`${import.meta.env.VITE_API_URL}/api/auth/customer/sign-in`, JSON.stringify(form), {
                headers: { 'Content-Type': 'application/json' },
            });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            router.visit(getRedirectPathFromUrl(defaultRedirectPath), { replace: true });
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.visit('/login', { replace: true });
    };

    return <AuthContext.Provider value={{ user, loading, error, login, logout, form, setForm }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};
