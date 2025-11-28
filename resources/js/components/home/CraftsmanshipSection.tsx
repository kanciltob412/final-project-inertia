import { Link } from '@inertiajs/react';

export default function CraftsmanshipSection() {
    return (
        <section className="w-full bg-gray-100 py-8 md:py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12 items-center">
                {/* Left: Images */}
                <div className="flex-1 flex gap-2 sm:gap-4 w-full">
                    <img
                        src="/craft-1.jpg"
                        alt="Crafting detail 1"
                        className="w-1/2 object-cover rounded-md h-40 md:h-48 lg:h-64"
                        style={{ minWidth: '0' }}
                    />
                    <img
                        src="/craft-2.jpg"
                        alt="Crafting detail 2"
                        className="w-1/2 object-cover rounded-md h-40 md:h-48 lg:h-64"
                        style={{ minWidth: '0' }}
                    />
                </div>
                {/* Right: Text */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-6 lg:mb-8 text-gray-900">Craftmanship</h2>
                    <p className="mb-4 md:mb-6 lg:mb-8 text-sm md:text-base lg:text-lg text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
                        Each piece is unique due to its traditional manufacturing process being able to appreciate light singularities in shape and texture.
                    </p>
                    <Link href="/craftsmanship" className="inline-block border-2 border-black px-4 md:px-8 py-2 md:py-3 text-sm md:text-base text-black hover:bg-black hover:text-white transition-colors">
                        See More
                    </Link>
                </div>
            </div>
        </section>
    );
}
