import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface MultiImageUploadProps {
    label?: string;
    value?: File[];
    onChange: (files: File[]) => void;
    maxImages?: number;
    disabled?: boolean;
    error?: string;
    accept?: string;
    existingImages?: string[];
    onRemoveExisting?: (path: string) => void;
}

export default function MultiImageUpload({
    label = 'Upload Images',
    value = [],
    onChange,
    maxImages = 5,
    disabled = false,
    error,
    accept = 'image/*',
    existingImages = [],
    onRemoveExisting,
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

        const newFiles = [...value, ...selectedFiles];
        onChange(newFiles);

        // Generate previews for new files
        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [...prev, reader.result as string]);
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
        setPreviews((prev) => prev.filter((_, i) => i !== index));
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

                {/* Existing images */}
                {existingImages.length > 0 && (
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Current Images</p>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {existingImages.map((imagePath, index) => (
                                <div key={`existing-${index}`} className="group relative">
                                    <img
                                        src={`/storage/${imagePath}`}
                                        alt={`Existing ${index + 1}`}
                                        className="h-32 w-full rounded-lg border object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={() => onRemoveExisting?.(imagePath)}
                                        disabled={disabled}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New image previews */}
                {value.length > 0 && (
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">New Images</p>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {value.map((file, index) => (
                                <div key={index} className="group relative">
                                    <img
                                        src={previews[index] || URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="h-32 w-full rounded-lg border object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={() => removeImage(index)}
                                        disabled={disabled}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Show message when no images */}
                {value.length === 0 && existingImages.length === 0 && (
                    <p className="text-sm text-gray-500">No images yet. Click "Add Images" to upload.</p>
                )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export { MultiImageUpload };
