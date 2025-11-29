import { Link } from '@inertiajs/react';

export default function HistorySection() {
    return (
        <section className="w-full bg-white py-8 md:py-12 lg:py-16">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 md:flex-row md:gap-8 md:px-6 lg:gap-12 lg:px-8">
                {/* Images First on mobile, second on desktop */}
                <div className="order-1 flex w-full flex-1 gap-2 sm:gap-4 md:order-2">
                    <img
                        src="/history-plates.jpg"
                        alt="Stacked plates"
                        className="h-40 w-1/2 rounded-md object-cover md:h-48 lg:h-64"
                        style={{ minWidth: '0' }}
                    />
                    <img
                        src="/history-hands.jpg"
                        alt="Crafting ceramics"
                        className="h-40 w-1/2 rounded-md object-cover md:h-48 lg:h-64"
                        style={{ minWidth: '0' }}
                    />
                </div>
                {/* Headline First on desktop, second on mobile */}
                <div className="order-2 flex-1 text-center md:order-1 md:text-left">
                    <h2 className="mb-4 text-2xl font-light text-gray-900 md:mb-6 md:text-4xl lg:mb-8 lg:text-5xl">Our Story</h2>
                    <p className="mx-auto mb-4 max-w-xl text-sm leading-relaxed text-gray-700 md:mx-0 md:mb-6 md:text-base lg:mb-8 lg:text-lg">
                        Born in 2025 amidst the creative heart of Ubud, Bali, Lavanya Ceramics transforms earth and fire into timeless works of art,
                        blending traditional craftsmanship with modern sensibility — now shared globally through our online collection.
                    </p>
                    <Link
                        href="/about"
                        className="inline-block border-2 border-black px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white md:px-8 md:py-3 md:text-base"
                    >
                        About Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
