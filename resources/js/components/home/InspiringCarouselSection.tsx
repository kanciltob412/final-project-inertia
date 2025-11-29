import { Link } from '@inertiajs/react';
import { useState } from 'react';

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
            <div className="mx-auto max-w-7xl px-4 text-center md:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-light text-gray-900 md:mb-8 md:text-4xl lg:mb-10 lg:text-5xl">Inspiring Products</h2>
                <Link
                    href="/products"
                    className="mb-6 inline-block border-2 border-black px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white md:mb-8 md:px-8 md:py-3 md:text-base lg:mb-10"
                >
                    See Collection
                </Link>
                <div className="mt-6 mb-6 flex flex-col justify-center gap-4 md:mt-8 md:mb-8 md:flex-row md:gap-6 lg:mt-10 lg:mb-10 lg:gap-8">
                    {slides[current].map((img, idx) => (
                        <Link key={idx} href={img.href} className="block">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="h-40 w-full rounded-md bg-gray-100 object-cover transition-opacity hover:opacity-80 md:h-[300px] md:w-[250px] lg:h-[400px] lg:w-[400px]"
                                style={{ minWidth: '0' }}
                            />
                        </Link>
                    ))}
                </div>
                <div className="mt-4 flex justify-center gap-2 md:mt-6 md:gap-3 lg:mt-8">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-2 w-2 rounded-full border-2 md:h-3 md:w-3 lg:h-4 lg:w-4 ${current === idx ? 'border-gray-400 bg-gray-400' : 'border-gray-400 bg-white'} transition-colors`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
