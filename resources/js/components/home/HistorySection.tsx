import { Link } from '@inertiajs/react';

export default function HistorySection() {
    return (
        <section className="w-full bg-white py-8 md:py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12 items-center">
                {/* Images First on mobile, second on desktop */}
                <div className="flex-1 flex gap-2 sm:gap-4 w-full order-1 md:order-2">
                    <img
                        src="/history-plates.jpg"
                        alt="Stacked plates"
                        className="w-1/2 object-cover rounded-md h-40 md:h-48 lg:h-64"
                        style={{ minWidth: '0' }}
                    />
                    <img
                        src="/history-hands.jpg"
                        alt="Crafting ceramics"
                        className="w-1/2 object-cover rounded-md h-40 md:h-48 lg:h-64"
                        style={{ minWidth: '0' }}
                    />
                </div>
                {/* Headline First on desktop, second on mobile */}
                <div className="flex-1 text-center md:text-left order-2 md:order-1">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-6 lg:mb-8 text-gray-900">Our Story</h2>
                    <p className="mb-4 md:mb-6 lg:mb-8 text-sm md:text-base lg:text-lg text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
                        Born in 2025 amidst the creative heart of Ubud, Bali, Lavanya Ceramics transforms earth and fire into timeless works of art, blending traditional craftsmanship with modern sensibility — now shared globally through our online collection.
                    </p>
                    <Link href="/about" className="inline-block border-2 border-black px-4 md:px-8 py-2 md:py-3 text-sm md:text-base text-black hover:bg-black hover:text-white transition-colors">
                        About Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
