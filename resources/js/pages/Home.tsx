import Footer from '@/components/Footer';
import HeroIndex from '@/components/home/HeroIndex';
import HistorySection from '@/components/home/HistorySection';
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection';
import InspiringCarouselSection from '@/components/home/InspiringCarouselSection';
import VisitUsSection from '@/components/home/VisitUsSection';
import Navbar from '@/components/Navbar';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import { motion } from 'framer-motion';
import { Head } from '@inertiajs/react';
const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1 },
};

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.3,
        },
    },
};

export default function Home() {
    return (
        <div>
            <Head title="Lavanya Ceramics - Luxury Ceramics for Hotels and Restaurants">
                <meta name="description" content="Discover Lavanya Ceramics, offering luxury ceramics for hotels and restaurants. Elevate your space with our exquisite designs." />
                <meta name="keywords" content="Lavanya Ceramics, luxury ceramics, hotel ceramics, restaurant ceramics, ceramic designs, high-end ceramics, bespoke ceramics, ceramic tableware, ceramic decor" />
            </Head>

            <Navbar></Navbar>
            <div className="bg-gray-50">
                {/* Hero Section with Video Background */}
                <HeroIndex />
                <HistorySection />
                <CraftsmanshipSection />
                <InspiringCarouselSection />
                <VisitUsSection />

                <div className="mx-auto max-w-7xl px-4 py-16">
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-2xl bg-black p-12 text-center text-white"
                    >
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
                            <h2 className="mb-4 text-3xl font-bold">Welcome to Lavanya Ceramics</h2>
                            <p className="mb-8 opacity-90">Subscribe to our newsletter to stay updated on our latest collections and exclusive offers.</p>
                            <NewsletterSubscription />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
