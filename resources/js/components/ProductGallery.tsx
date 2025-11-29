import { ProductImage } from '@/types';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useState } from 'react';

interface ProductGalleryProps {
    mainImage: string;
    images: ProductImage[];
    productName: string;
}

export default function ProductGallery({ mainImage, images, productName }: ProductGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    // Combine main image with gallery images
    const allImages = [
        {
            id: 0,
            image_path: mainImage,
            alt_text: productName,
            sort_order: 0,
            is_primary: true,
        },
        ...images.filter((img) => !img.is_primary),
    ];

    const currentImage = allImages[currentImageIndex];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div className="space-y-4">
            {/* Zoom Modal */}
            {isZoomed && (
                <div className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="relative max-h-screen max-w-6xl p-4">
                        <button onClick={toggleZoom} className="absolute top-2 right-2 z-10 rounded-full bg-white p-2 text-black hover:bg-gray-100">
                            <X className="h-6 w-6" />
                        </button>
                        <img
                            src={`/storage/${currentImage.image_path}`}
                            alt={currentImage.alt_text || productName}
                            className="max-h-full max-w-full object-contain"
                        />

                        {/* Navigation arrows in zoom modal */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black hover:bg-white"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black hover:bg-white"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Main Image Display */}
            <div className="relative">
                <div
                    className="relative aspect-square cursor-zoom-in overflow-hidden rounded-lg"
                    onClick={toggleZoom}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => {
                        setMousePosition({ x: 50, y: 50 });
                        setIsHovering(false);
                    }}
                >
                    <img
                        src={`/storage/${currentImage.image_path}`}
                        alt={currentImage.alt_text || productName}
                        className={`h-full w-full object-cover transition-all duration-200 ease-out ${isHovering ? 'scale-150' : 'scale-100'}`}
                        style={{
                            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        }}
                    />

                    {/* Click to zoom indicator */}
                    <div className="absolute top-4 right-4 opacity-70">
                        <div className="bg-opacity-50 rounded-full bg-black p-2 text-white">
                            <ZoomIn className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Navigation arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}

                    {/* Image indicator */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            <div className="flex space-x-2">
                                {allImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                        className={`h-2 w-2 rounded-full transition-colors ${
                                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {allImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                index === currentImageIndex ? 'border-black shadow-md' : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            <img
                                src={`/storage/${image.image_path}`}
                                alt={image.alt_text || `${productName} - Image ${index + 1}`}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
