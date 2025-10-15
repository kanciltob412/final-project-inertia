import Footer from '@/components/Footer';
import HeroIndex from '@/components/home/HeroIndex';
import HistorySection from '@/components/home/HistorySection';
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection';
import InspiringCarouselSection from '@/components/home/InspiringCarouselSection';
import VisitUsSection from '@/components/home/VisitUsSection';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
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
                        className="relative overflow-hidden rounded-2xl bg-[#423F3B] p-12 text-center text-white"
                    >
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
                            <h2 className="mb-4 text-3xl font-bold">Join Our Newsletter</h2>
                            <p className="mb-8 opacity-90">Subscribe to get special offers, free giveaways, and updates.</p>
                            <form className="mx-auto flex max-w-md gap-4">
                                <input type="email" placeholder="Enter your email" className="flex-1 rounded-md bg-white px-4 py-3 text-black" />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="rounded-md bg-white px-8 py-3 text-black hover:bg-gray-100"
                                >
                                    Subscribe
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
