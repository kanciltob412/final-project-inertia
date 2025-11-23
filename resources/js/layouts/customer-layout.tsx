import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Head } from '@inertiajs/react';

interface CustomerLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function CustomerLayout({ children, title = 'Customer Dashboard' }: CustomerLayoutProps) {
    return (
        <div>
            <Head title={title} />
            <Navbar forceBlack={true} />
            <div className="min-h-screen bg-white pt-20">
                {children}
            </div>
            <Footer />
        </div>
    );
}
