import { Link } from '@inertiajs/react';

export default function VisitUsSection() {
    return (
        <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
            <img
                src="/visit-bg.jpg"
                alt="Visit Us Background"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.5)' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
                <h2 className="text-5xl font-light mb-4">COME VISIT US</h2>
                <p className="mb-8 text-xl">Our design and manufacturing workshop are open to visitors</p>
                <Link href="/contact" className="inline-block border-2 border-white px-8 py-3 text-lg hover:bg-white hover:text-black transition-colors">
                    SEE MAP
                </Link>
            </div>
        </section>
    );
}
