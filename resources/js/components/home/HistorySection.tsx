import { Link } from '@inertiajs/react';

export default function HistorySection() {
    return (
        <section className="w-full bg-white py-10 sm:py-16">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 flex flex-col md:flex-row gap-4 sm:gap-8 items-center">
                {/* Images First on mobile, second on desktop */}
                <div className="flex-1 flex gap-2 sm:gap-4 w-full order-1 md:order-2">
                    <img
                        src="/history-plates.jpg"
                        alt="Stacked plates"
                        className="w-1/2 object-cover rounded-md h-32 sm:h-48 md:h-64"
                        style={{ minWidth: '0' }}
                    />
                    <img
                        src="/history-hands.jpg"
                        alt="Crafting ceramics"
                        className="w-1/2 object-cover rounded-md h-32 sm:h-48 md:h-64"
                        style={{ minWidth: '0' }}
                    />
                </div>
                {/* Headline First on desktop, second on mobile */}
                <div className="flex-1 text-center md:text-left order-2 md:order-1">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-8">Our Story</h2>
                    <p className="mb-4 sm:mb-8 text-base sm:text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
                        Born in 2025 amidst the creative heart of Ubud, Bali, Lavanya Ceramics transforms earth and fire into timeless works of art, blending traditional craftsmanship with modern sensibility — now shared globally through our online collection.
                    </p>
                    <Link href="/about" className="inline-block border-2 border-black px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-lg text-black hover:bg-black hover:text-white transition-colors">
                        About Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
