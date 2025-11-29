import { Link } from '@inertiajs/react';

export default function CraftsmanshipSection() {
    return (
        <section className="w-full bg-gray-100 py-8 md:py-12 lg:py-16">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 md:flex-row md:gap-8 md:px-6 lg:gap-12 lg:px-8">
                {/* Left: Images */}
                <div className="flex w-full flex-1 gap-2 sm:gap-4">
                    <img
                        src="/craft-1.jpg"
                        alt="Crafting detail 1"
                        className="h-40 w-1/2 rounded-md object-cover md:h-48 lg:h-64"
                        style={{ minWidth: '0' }}
                    />
                    <img
                        src="/craft-2.jpg"
                        alt="Crafting detail 2"
                        className="h-40 w-1/2 rounded-md object-cover md:h-48 lg:h-64"
                        style={{ minWidth: '0' }}
                    />
                </div>
                {/* Right: Text */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="mb-4 text-2xl font-light text-gray-900 md:mb-6 md:text-4xl lg:mb-8 lg:text-5xl">Craftmanship</h2>
                    <p className="mx-auto mb-4 max-w-xl text-sm leading-relaxed text-gray-700 md:mx-0 md:mb-6 md:text-base lg:mb-8 lg:text-lg">
                        Each piece is unique due to its traditional manufacturing process being able to appreciate light singularities in shape and
                        texture.
                    </p>
                    <Link
                        href="/craftsmanship"
                        className="inline-block border-2 border-black px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white md:px-8 md:py-3 md:text-base"
                    >
                        See More
                    </Link>
                </div>
            </div>
        </section>
    );
}
