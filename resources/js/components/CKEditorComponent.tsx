import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CKEditorComponentProps {
    data: string;
    onChange: (data: string) => void;
    disabled?: boolean;
    placeholder?: string;
    height?: number;
}

export default function CKEditorComponent({
    data,
    onChange,
    disabled = false,
    placeholder = "Start writing...",
    height = 300
}: CKEditorComponentProps) {
    const [content, setContent] = useState(data || '');

    useEffect(() => {
        setContent(data || '');
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChange(newContent);
    };

    return (
        <div className="w-full">
            <Textarea
                value={content}
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder}
                style={{ minHeight: `${height}px` }}
                className="min-h-[300px] resize-y"
            />
            <div className="text-xs text-gray-500 mt-1">
                Rich text editor temporarily simplified
            </div>
        </div>
    );
}