import { Link } from '@inertiajs/react';

export default function VisitUsSection() {
    return (
        <section className="relative flex h-40 w-full items-center justify-center overflow-hidden md:h-72 lg:h-96">
            <img
                src="/visit-bg.jpg"
                alt="Visit Us Background"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: 'brightness(0.5)' }}
            />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white md:px-6 lg:px-8">
                <h2 className="mb-3 text-2xl font-light text-white md:mb-4 md:text-4xl lg:mb-6 lg:text-5xl">Come Visit Us</h2>
                <p className="mb-4 text-sm leading-relaxed text-white md:mb-6 md:text-base lg:mb-8 lg:text-lg">
                    Our design and manufacturing workshop are open to visitors
                </p>
                <Link
                    href="/contact"
                    className="inline-block border-2 border-white px-4 py-2 text-sm transition-colors hover:bg-white hover:text-black md:px-8 md:py-3 md:text-base"
                >
                    See Map
                </Link>
            </div>
        </section>
    );
}
