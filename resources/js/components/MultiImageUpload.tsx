import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Star } from 'lucide-react';

interface GalleryImage {
    id?: number;
    url?: string;
    file?: File;
    is_primary?: boolean;
    alt_text?: string;
    sort_order?: number;
}

interface MultiImageUploadProps {
    label?: string;
    value?: GalleryImage[];
    onChange: (files: GalleryImage[]) => void;
    maxImages?: number;
    disabled?: boolean;
    error?: string;
    accept?: string;
}

export default function MultiImageUpload({
    label = 'Upload Images',
    value = [],
    onChange,
    maxImages = 5,
    disabled = false,
    error,
    accept = 'image/*'
}: MultiImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (selectedFiles.length === 0) return;

        const totalFiles = value.length + selectedFiles.length;
        if (totalFiles > maxImages) {
            alert(`You can only upload up to ${maxImages} images.`);
            return;
        }

        // Convert File objects to GalleryImage format
        const newGalleryImages: GalleryImage[] = selectedFiles.map((file, idx) => ({
            file,
            is_primary: value.length === 0 && idx === 0, // First image is primary if no existing images
            sort_order: value.length + idx
        }));

        const newFiles = [...value, ...newGalleryImages];
        onChange(newFiles);

        // Generate previews for new files
        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Clear input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange(newFiles);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const setFeaturedImage = (index: number) => {
        const newFiles = value.map((img, i) => ({
            ...img,
            is_primary: i === index
        }));
        onChange(newFiles);
    };

    const getImageUrl = (image: GalleryImage, index: number): string => {
        if (image.url) {
            return image.url;
        }
        if (image.file) {
            return previews[index] || URL.createObjectURL(image.file);
        }
        return '';
    };

    return (
        <div className="grid w-full items-center gap-2">
            <Label>{label}</Label>

            <div className="space-y-4">
                {/* Upload button */}
                <div className="flex items-center gap-2">
                    <Input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={disabled || value.length >= maxImages}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || value.length >= maxImages}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Images
                    </Button>
                    <span className="text-sm text-gray-500">
                        {value.length}/{maxImages} images
                    </span>
                </div>

                {/* Image previews */}
                {value.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {value.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={getImageUrl(image, index)}
                                    alt={`Preview ${index + 1}`}
                                    className={`w-full aspect-square object-cover rounded-lg border-2 transition-all ${
                                        image.is_primary ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-300'
                                    }`}
                                />
                                {image.is_primary && (
                                    <div className="absolute top-1 left-1 bg-yellow-400 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-white" />
                                        Featured
                                    </div>
                                )}
                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!image.is_primary && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="h-6 w-6 rounded-full p-0 bg-yellow-400 hover:bg-yellow-500 text-white"
                                            onClick={() => setFeaturedImage(index)}
                                            disabled={disabled}
                                            title="Set as featured image"
                                        >
                                            <Star className="h-3 w-3" />
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="h-6 w-6 rounded-full p-0"
                                        onClick={() => removeImage(index)}
                                        disabled={disabled}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

export { MultiImageUpload };