import { Link } from '@inertiajs/react';

export default function HistorySection() {
    return (
        <section className="w-full bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row gap-8 items-center">
                {/* Left: Text */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-5xl font-light mb-8">OUR STORY</h2>
                    <p className="mb-8 text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
                        Born in 2025 amidst the creative heart of Ubud, Bali, Lavanya Ceramics transforms earth and fire into timeless works of art, blending traditional craftsmanship with modern sensibility — now shared globally through our online collection.
                    </p>
                    <Link href="/about" className="inline-block border-2 border-black px-8 py-3 text-lg text-black hover:bg-black hover:text-white transition-colors">
                        ABOUT US
                    </Link>
                </div>
                {/* Right: Images */}
                <div className="flex-1 flex gap-4">
                    <img
                        src="/history-plates.jpg"
                        alt="Stacked plates"
                        className="w-1/2 object-cover rounded-md h-64"
                        style={{ minWidth: '0' }}
                    />
                    <img
                        src="/history-hands.jpg"
                        alt="Crafting ceramics"
                        className="w-1/2 object-cover rounded-md h-64"
                        style={{ minWidth: '0' }}
                    />
                </div>
            </div>
        </section>
    );
}
