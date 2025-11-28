import { Link } from '@inertiajs/react';

export default function VisitUsSection() {
    return (
        <section className="relative w-full h-40 md:h-72 lg:h-96 flex items-center justify-center overflow-hidden">
            <img
                src="/visit-bg.jpg"
                alt="Visit Us Background"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.5)' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4 md:px-6 lg:px-8">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-light mb-3 md:mb-4 lg:mb-6 text-white">Come Visit Us</h2>
                <p className="mb-4 md:mb-6 lg:mb-8 text-sm md:text-base lg:text-lg text-white leading-relaxed">Our design and manufacturing workshop are open to visitors</p>
                <Link href="/contact" className="inline-block border-2 border-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-base hover:bg-white hover:text-black transition-colors">
                    See Map
                </Link>
            </div>
        </section>
    );
}
