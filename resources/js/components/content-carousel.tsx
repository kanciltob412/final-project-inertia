import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CarouselItem {
    id: number;
    type: string;
    title: string;
    description?: string;
    image_url?: string;
    link_url?: string;
    content?: string;
}

interface ContentCarouselProps {
    items: CarouselItem[];
    autoPlay?: boolean;
    interval?: number;
}

export default function ContentCarousel({ items, autoPlay = true, interval = 5000 }: ContentCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!autoPlay || items.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, items.length]);

    if (items.length === 0) return null;

    const current = items[currentIndex];

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    return (
        <div className="group relative h-56 w-full overflow-hidden rounded-lg bg-gray-200 sm:h-64 md:h-80 lg:h-96">
            {/* Image or Gradient Background */}
            {current.image_url ? (
                <img
                    src={current.image_url}
                    alt={current.title}
                    className="h-full w-full object-cover transition-transform duration-500"
                    style={{ objectPosition: 'center' }}
                />
            ) : (
                <div className="h-full w-full bg-linear-to-r from-blue-400 to-purple-600"></div>
            )}

            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/60 via-black/30 to-transparent">
                <div className="z-15 px-2 text-center text-white sm:px-4">
                    <h2 className="mb-2 text-lg font-bold sm:text-2xl md:text-4xl">{current.title}</h2>
                    {current.description && <p className="text-xs sm:text-sm md:text-lg">{current.description}</p>}
                </div>
            </div>

            {/* Link Overlay */}
            {current.link_url && <a href={current.link_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />}

            {/* Navigation Buttons */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 sm:p-2 md:p-3"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 sm:p-2 md:p-3"
                        aria-label="Next"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all ${
                                    index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Counter */}
            {items.length > 1 && (
                <div className="absolute top-4 right-4 z-20 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                    {currentIndex + 1} / {items.length}
                </div>
            )}
        </div>
    );
}
