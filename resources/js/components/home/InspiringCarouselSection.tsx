import { useState } from 'react';
import { Link } from '@inertiajs/react';

const slides = [
    [
        { src: '/inspire-1.jpg', alt: 'Inspiring 1', href: '/products/1' },
        { src: '/inspire-2.jpg', alt: 'Inspiring 2', href: '/products/2' },
        { src: '/inspire-3.jpg', alt: 'Inspiring 3', href: '/products/3' },
    ],
    [
        { src: '/inspire-4.jpg', alt: 'Inspiring 4', href: '/products/4' },
        { src: '/inspire-5.jpg', alt: 'Inspiring 5', href: '/products/5' },
        { src: '/inspire-6.jpg', alt: 'Inspiring 6', href: '/products/6' },
    ],
];

export default function InspiringCarouselSection() {
    const [current, setCurrent] = useState(0);

    return (
        <section className="w-full bg-white py-10 sm:py-16">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 text-center">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-light mb-6 sm:mb-8">Inspiring Products</h2>
                <Link href="/products" className="inline-block border-2 border-black px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-lg mb-6 sm:mb-8 hover:bg-black hover:text-white transition-colors">
                    See Collection
                </Link>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-6 sm:mb-8 mt-6 sm:mt-8">
                    {slides[current].map((img, idx) => (
                        <Link key={idx} href={img.href} className="block">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="object-cover rounded-md w-full h-40 sm:h-[250px] md:h-[350px] sm:w-[220px] md:w-[400px] bg-gray-100 hover:opacity-80 transition-opacity"
                                style={{ minWidth: '0' }}
                            />
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 ${current === idx ? 'bg-gray-400 border-gray-400' : 'bg-white border-gray-400'} transition-colors`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
