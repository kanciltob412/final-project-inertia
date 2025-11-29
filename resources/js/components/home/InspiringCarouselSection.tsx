import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    discount?: number;
    discount_type?: 'fixed' | 'percentage';
    images?: Array<{
        id: number;
        image_path: string;
        is_primary: boolean;
        sort_order: number;
    }>;
}

interface Props {
    products: Product[];
}

export default function InspiringCarouselSection({ products }: Props) {
    const [current, setCurrent] = useState(0);

    // Split products into groups of 3 for carousel slides
    const slides = [];
    for (let i = 0; i < products.length; i += 3) {
        slides.push(products.slice(i, i + 3));
    }

    // If no products, show placeholder slides
    const displaySlides = slides.length > 0 ? slides : [
        [
            { id: 1, name: 'Product 1', sku: 'PRD-001', price: 0, images: [{ id: 1, image_path: '/inspire-1.jpg', is_primary: true, sort_order: 1 }] },
            { id: 2, name: 'Product 2', sku: 'PRD-002', price: 0, images: [{ id: 2, image_path: '/inspire-2.jpg', is_primary: true, sort_order: 1 }] },
            { id: 3, name: 'Product 3', sku: 'PRD-003', price: 0, images: [{ id: 3, image_path: '/inspire-3.jpg', is_primary: true, sort_order: 1 }] },
        ],
    ];

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
                    {displaySlides[current].map((product, idx) => {
                        const imageUrl = product.images && product.images.length > 0
                            ? `/storage/${product.images[0].image_path}`
                            : '/inspire-placeholder.jpg';

                        return (
                            <Link key={idx} href={`/products/${product.id}`} className="block">
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="h-40 w-full rounded-md bg-gray-100 object-cover transition-opacity hover:opacity-80 md:h-[300px] md:w-[250px] lg:h-[400px] lg:w-[400px]"
                                    style={{ minWidth: '0' }}
                                />
                            </Link>
                        );
                    })}
                </div>
                <div className="mt-4 flex justify-center gap-2 md:mt-6 md:gap-3 lg:mt-8">
                    {displaySlides.map((_, idx) => (
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
