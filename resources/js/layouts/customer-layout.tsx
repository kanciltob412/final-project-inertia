import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

interface CustomerLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function CustomerLayout({ children, title = 'Customer Dashboard' }: CustomerLayoutProps) {
    return (
        <div>
            <Head title={title} />
            <Navbar forceBlack={true} />
            <div className="min-h-screen bg-white pt-20">{children}</div>
            <Footer />
        </div>
    );
}
