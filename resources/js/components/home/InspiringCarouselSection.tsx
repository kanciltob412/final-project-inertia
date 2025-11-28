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
        <section className="w-full bg-white py-8 md:py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 text-center">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-light mb-6 md:mb-8 lg:mb-10 text-gray-900">Inspiring Products</h2>
                <Link href="/products" className="inline-block border-2 border-black px-4 md:px-8 py-2 md:py-3 text-sm md:text-base mb-6 md:mb-8 lg:mb-10 hover:bg-black hover:text-white transition-colors text-black">
                    See Collection
                </Link>
                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-10 mt-6 md:mt-8 lg:mt-10">
                    {slides[current].map((img, idx) => (
                        <Link key={idx} href={img.href} className="block">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="object-cover rounded-md w-full h-40 md:h-[300px] lg:h-[400px] md:w-[250px] lg:w-[400px] bg-gray-100 hover:opacity-80 transition-opacity"
                                style={{ minWidth: '0' }}
                            />
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center gap-2 md:gap-3 mt-4 md:mt-6 lg:mt-8">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-2 w-2 md:h-3 md:w-3 lg:h-4 lg:w-4 rounded-full border-2 ${current === idx ? 'bg-gray-400 border-gray-400' : 'bg-white border-gray-400'} transition-colors`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
