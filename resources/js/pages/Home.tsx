import Footer from '@/components/Footer';
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection';
import HeroIndex from '@/components/home/HeroIndex';
import HistorySection from '@/components/home/HistorySection';
import InspiringCarouselSection from '@/components/home/InspiringCarouselSection';
import VisitUsSection from '@/components/home/VisitUsSection';
import Navbar from '@/components/Navbar';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    discount?: number;
    discount_type?: 'fixed' | 'percentage';
    images?: Array<{
        id: number;
        image_path: string;
        is_primary: boolean;
        sort_order: number;
    }>;
}

interface Props {
    featuredProducts: Product[];
}

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1 },
};

export default function Home({ featuredProducts }: Props) {
    return (
        <div>
            <Head title="Lavanya Ceramics - Luxury Ceramics for Hotels and Restaurants">
                <meta
                    name="description"
                    content="Discover Lavanya Ceramics, offering luxury ceramics for hotels and restaurants. Elevate your space with our exquisite designs."
                />
                <meta
                    name="keywords"
                    content="Lavanya Ceramics, luxury ceramics, hotel ceramics, restaurant ceramics, ceramic designs, high-end ceramics, bespoke ceramics, ceramic tableware, ceramic decor"
                />
            </Head>

            <Navbar></Navbar>
            <div className="bg-gray-50">
                {/* Hero Section with Video Background */}
                <HeroIndex />
                <HistorySection />
                <CraftsmanshipSection />
                <InspiringCarouselSection products={featuredProducts} />
                <VisitUsSection />

                <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-900 via-gray-950 to-gray-800 p-12 text-center text-white shadow-2xl"
                    >
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
                            <NewsletterSubscription />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
