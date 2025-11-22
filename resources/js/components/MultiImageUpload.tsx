import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface MultiImageUploadProps {
    label?: string;
    value?: File[];
    onChange: (files: File[]) => void;
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

        const newFiles = [...value, ...selectedFiles];
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {value.map((file, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={previews[index] || URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                    disabled={disabled}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
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