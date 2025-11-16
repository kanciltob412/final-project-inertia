import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload } from 'lucide-react';

interface ImageUploadProps {
    id?: string;
    label?: string;
    value?: File | null;
    onChange: (file: File | null) => void;
    disabled?: boolean;
    currentImage?: string;
    currentImageAlt?: string;
    error?: string;
    accept?: string;
}

export default function ImageUpload({
    id = 'image-upload',
    label = 'Upload Image',
    onChange,
    disabled = false,
    currentImage,
    currentImageAlt = 'Current image',
    error,
    accept = 'image/*'
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }

        onChange(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayImage = preview || (currentImage ? `/storage/${currentImage}` : null);

    return (
        <div className="grid w-full items-center gap-2">
            <Label htmlFor={id}>{label}</Label>

            <div className="flex flex-col gap-4">
                {displayImage && (
                    <div className="relative inline-block">
                        <img
                            src={displayImage}
                            alt={currentImageAlt}
                            className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={handleRemove}
                            disabled={disabled}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Input
                        ref={fileInputRef}
                        id={id}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={disabled}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className="flex items-center gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        {displayImage ? 'Change Image' : 'Upload Image'}
                    </Button>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

export { ImageUpload };