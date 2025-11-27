import { Link } from '@inertiajs/react';

export default function CraftsmanshipSection() {
    return (
        <section className="w-full bg-gray-100 py-10 sm:py-16">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 flex flex-col md:flex-row gap-4 sm:gap-8 items-center">
                {/* Left: Images */}
                <div className="flex-1 flex gap-2 sm:gap-4 w-full">
                    <img
                        src="/craft-1.jpg"
                        alt="Crafting detail 1"
                        className="w-1/2 object-cover rounded-md h-32 sm:h-48 md:h-64"
                        style={{ minWidth: '0' }}
                    />
                    <img
                        src="/craft-2.jpg"
                        alt="Crafting detail 2"
                        className="w-1/2 object-cover rounded-md h-32 sm:h-48 md:h-64"
                        style={{ minWidth: '0' }}
                    />
                </div>
                {/* Right: Text */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-8">Craftmanship</h2>
                    <p className="mb-4 sm:mb-8 text-base sm:text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
                        Each piece is unique due to its traditional manufacturing process being able to appreciate light singularities in shape and texture.
                    </p>
                    <Link href="/craftsmanship" className="inline-block border-2 border-black px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-lg text-black hover:bg-black hover:text-white transition-colors">
                        See More
                    </Link>
                </div>
            </div>
        </section>
    );
}
