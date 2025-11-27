import { Link } from '@inertiajs/react';

export default function VisitUsSection() {
    return (
        <section className="relative w-full h-48 sm:h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
            <img
                src="/visit-bg.jpg"
                alt="Visit Us Background"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.5)' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4 sm:px-0">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-light mb-2 sm:mb-4">Come Visit Us</h2>
                <p className="mb-4 sm:mb-8 text-base sm:text-xl">Our design and manufacturing workshop are open to visitors</p>
                <Link href="/contact" className="inline-block border-2 border-white px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-lg hover:bg-white hover:text-black transition-colors">
                    See Map
                </Link>
            </div>
        </section>
    );
}
