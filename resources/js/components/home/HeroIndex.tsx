import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function HeroIndex() {
    return (
        <div className="relative h-[60vh] overflow-hidden">
            <img
                src="https://img.freepik.com/free-photo/view-hawaiian-shirt-with-floral-print-hanger-belt_23-2149366089.jpg?t=st=1738212195~exp=1738215795~hmac=74cb62fe35e7ee08fe4aa7c2b9276d98bd7d15ac8c0ec9bc7501941077b589e2&w=1800"
                alt=""
            />
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <div className="max-w-3xl px-4 text-center text-white">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-6 text-6xl font-bold"
                    >
                        Elevate Your Style
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mb-8 text-xl opacity-90"
                    >
                        Discover our curated collection of premium apparel that combines comfort, style, and sustainability.
                    </motion.p>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 2, duration: 0.8 }}
                        className="flex justify-center gap-4"
                    >
                        <Link href="/products" className="inline-flex items-center rounded-md bg-white px-8 py-3 text-black hover:bg-gray-100">
                            Shop Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            href="/about"
                            className="rounded-md border-2 border-white px-8 py-3 text-white transition-colors hover:bg-white hover:text-black"
                        >
                            Learn More
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default HeroIndex;
