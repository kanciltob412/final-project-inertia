import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSlide {
    id?: number;
    image_path?: string;
    image?: string;
    title: string;
    subtitle: string;
    description: string;
    button_1_text?: string | null;
    button_1_url?: string | null;
    button_2_text?: string | null;
    button_2_url?: string | null;
}

interface Props {
    carousels?: HeroSlide[];
}

const defaultHeroSlides: HeroSlide[] = [
    {
        image: '/hero.jpg',
        title: 'Elevate Your Spaces',
        subtitle: 'Premium Ceramic Collections',
        description: 'Discover our curated collection of premium ceramics that blend timeless elegance, artisanal craftsmanship, and modern design.',
    },
    {
        image: '/inspire-1.jpg',
        title: 'Artisanal Excellence',
        subtitle: 'Handcrafted Perfection',
        description: 'Each piece is meticulously crafted by skilled artisans, bringing centuries of ceramic tradition to your modern spaces.',
    },
    {
        image: '/inspire-2.jpg',
        title: 'Luxury Hospitality',
        subtitle: 'Hotel & Restaurant Collections',
        description:
            'Transform your hospitality spaces with our exclusive ceramic collections designed for luxury hotels and fine dining establishments.',
    },
    {
        image: '/inspire-3.jpg',
        title: 'Timeless Elegance',
        subtitle: 'Classic Meets Contemporary',
        description: 'Experience the perfect fusion of traditional ceramic artistry with contemporary design aesthetics for the modern connoisseur.',
    },
];

function HeroIndex({ carousels = [] }: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Use provided carousels or fallback to defaults
    const heroSlides: HeroSlide[] = carousels && carousels.length > 0
        ? carousels.map(slide => ({
            ...slide,
            image: slide.image_path ? `/storage/${slide.image_path}` : slide.image || '/hero.jpg',
        }))
        : defaultHeroSlides;

    // Auto-advance slides
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, heroSlides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    return (
        <div className="relative h-[500px] overflow-hidden sm:h-[650px] md:h-[750px] lg:h-[879px]">
            <style>{`
                @keyframes kenburns-top {
                    0% {
                        transform: scale(1) translateY(0);
                    }
                    100% {
                        transform: scale(1.15) translateY(-20px);
                    }
                }
                @keyframes kenburns-bottom {
                    0% {
                        transform: scale(1) translateY(0);
                    }
                    100% {
                        transform: scale(1.15) translateY(20px);
                    }
                }
                @keyframes kenburns-left {
                    0% {
                        transform: scale(1) translateX(0);
                    }
                    100% {
                        transform: scale(1.15) translateX(-30px);
                    }
                }
                @keyframes kenburns-right {
                    0% {
                        transform: scale(1) translateX(0);
                    }
                    100% {
                        transform: scale(1.15) translateX(30px);
                    }
                }
                .kenburns-top {
                    animation: kenburns-top 5s ease-out forwards;
                }
                .kenburns-bottom {
                    animation: kenburns-bottom 5s ease-out forwards;
                }
                .kenburns-left {
                    animation: kenburns-left 5s ease-out forwards;
                }
                .kenburns-right {
                    animation: kenburns-right 5s ease-out forwards;
                }
            `}</style>
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentSlide}
                    src={heroSlides[currentSlide].image}
                    alt={heroSlides[currentSlide].title}
                    className={`absolute h-full w-full object-cover ${currentSlide % 4 === 0
                        ? 'kenburns-top'
                        : currentSlide % 4 === 1
                            ? 'kenburns-bottom'
                            : currentSlide % 4 === 2
                                ? 'kenburns-left'
                                : 'kenburns-right'
                        }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                />
            </AnimatePresence>

            <div className="absolute inset-0 bg-black/30" />

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
            >
                <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
            >
                <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-3 w-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="max-w-3xl px-4 text-center text-white">
                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="mb-2 text-sm tracking-wider uppercase opacity-80 sm:text-base md:text-lg"
                        >
                            {heroSlides[currentSlide].subtitle}
                        </motion.p>

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="mb-4 text-3xl font-bold md:text-5xl lg:text-6xl"
                        >
                            {heroSlides[currentSlide].title}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="mb-6 text-sm opacity-90 md:text-base lg:text-lg"
                        >
                            {heroSlides[currentSlide].description}
                        </motion.p>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col items-center justify-center gap-4 md:flex-row"
                        >
                            {/* Button 1 */}
                            {(heroSlides[currentSlide].button_1_text && heroSlides[currentSlide].button_1_url) ? (
                                <Link
                                    href={heroSlides[currentSlide].button_1_url!}
                                    className="mx-auto inline-flex w-auto max-w-[220px] min-w-[140px] items-center justify-center rounded-md bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-gray-100 md:mx-0 md:max-w-none md:min-w-0 md:px-8 md:py-3 md:text-base"
                                >
                                    {heroSlides[currentSlide].button_1_text}
                                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                </Link>
                            ) : (
                                <Link
                                    href="/products"
                                    className="mx-auto inline-flex w-auto max-w-[220px] min-w-[140px] items-center justify-center rounded-md bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-gray-100 md:mx-0 md:max-w-none md:min-w-0 md:px-8 md:py-3 md:text-base"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                </Link>
                            )}

                            {/* Button 2 */}
                            {(heroSlides[currentSlide].button_2_text && heroSlides[currentSlide].button_2_url) ? (
                                <Link
                                    href={heroSlides[currentSlide].button_2_url!}
                                    className="mx-auto w-auto max-w-[220px] min-w-[140px] rounded-md border-2 border-white px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black md:mx-0 md:max-w-none md:min-w-0 md:px-8 md:py-3 md:text-base"
                                >
                                    {heroSlides[currentSlide].button_2_text}
                                </Link>
                            ) : (
                                <Link
                                    href="/about"
                                    className="mx-auto w-auto max-w-[220px] min-w-[140px] rounded-md border-2 border-white px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black md:mx-0 md:max-w-none md:min-w-0 md:px-8 md:py-3 md:text-base"
                                >
                                    Learn More
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default HeroIndex;
