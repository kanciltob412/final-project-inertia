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
    height = 200 
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
                style={{ height: `${height}px` }}
                className="min-h-[200px] resize-y"
            />
        </div>
    );
}