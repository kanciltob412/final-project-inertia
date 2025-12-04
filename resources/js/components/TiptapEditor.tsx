import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useEffect } from 'react';
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Code,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo2,
    Redo2,
    Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    disabled?: boolean;
}

export default function TiptapEditor({ content, onChange, disabled = false }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Image.configure({
                allowBase64: true,
            }),
            TextStyle,
            Color,
        ],
        content: content || '<p>Start typing...</p>',
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // Clean up empty list items
            const cleaned = html
                .replace(/<li><\/li>/g, '')
                .replace(/<li>\s*<\/li>/g, '')
                .replace(/<[ou]l>\s*<\/[ou]l>/g, '');
            onChange(cleaned);
        },
    });

    useEffect(() => {
        if (!editor) return;
        if (content && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const handleLinkClick = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const handleImageClick = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const handleTextColor = () => {
        const color = window.prompt('Enter color (hex or name):');
        if (color) {
            editor.chain().focus().setColor(color).run();
        }
    };

    return (
        <div className="rounded border border-gray-300 bg-white shadow-sm overflow-hidden max-w-none">
            {/* Main Toolbar */}
            <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('bold') ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('italic') ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('code') ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Inline Code"
                    >
                        <Code className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleTextColor}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Text Color"
                    >
                        <Type className="h-4 w-4" />
                    </Button>
                </div>

                <div className="border-l border-gray-300 mx-1" />

                {/* Headings */}
                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        disabled={disabled}
                        className="h-9 px-2 text-xs font-bold"
                        title="Heading 1"
                    >
                        H1
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        disabled={disabled}
                        className="h-9 px-2 text-xs font-bold"
                        title="Heading 2"
                    >
                        H2
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        disabled={disabled}
                        className="h-9 px-2 text-xs font-bold"
                        title="Heading 3"
                    >
                        H3
                    </Button>
                </div>

                <div className="border-l border-gray-300 mx-1" />

                {/* Lists */}
                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                </div>

                <div className="border-l border-gray-300 mx-1" />

                {/* Block Elements */}
                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        disabled={disabled}
                        className="h-9 px-2 text-xs"
                        title="Code Block"
                    >
                        Code
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Blockquote"
                    >
                        <Quote className="h-4 w-4" />
                    </Button>
                </div>

                <div className="border-l border-gray-300 mx-1" />

                {/* Media */}
                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive('link') ? 'default' : 'outline'}
                        onClick={handleLinkClick}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Add Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleImageClick}
                        disabled={disabled}
                        className="h-9 w-9 p-0"
                        title="Add Image"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                </div>

                <div className="border-l border-gray-300 mx-1" />

                {/* History */}
                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={disabled || !editor.can().undo()}
                        className="h-9 w-9 p-0"
                        title="Undo"
                    >
                        <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={disabled || !editor.can().redo()}
                        className="h-9 w-9 p-0"
                        title="Redo"
                    >
                        <Redo2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="min-h-[300px] max-w-none overflow-auto p-4 prose prose-sm">
                <style>{`
                    .tiptap {
                        outline: none;
                        font-family: inherit;
                    }
                    
                    .tiptap p {
                        margin: 0.5em 0;
                    }
                    
                    .tiptap h1 {
                        font-size: 2em;
                        font-weight: bold;
                        margin: 0.67em 0;
                        line-height: 1.2;
                    }
                    
                    .tiptap h2 {
                        font-size: 1.5em;
                        font-weight: bold;
                        margin: 0.75em 0;
                        line-height: 1.2;
                    }
                    
                    .tiptap h3 {
                        font-size: 1.17em;
                        font-weight: bold;
                        margin: 0.83em 0;
                        line-height: 1.2;
                    }
                    
                    .tiptap ul, .tiptap ol {
                        padding-left: 2em;
                        margin: 1em 0;
                        list-style: inherit;
                    }
                    
                    .tiptap li {
                        margin: 0.5em 0;
                        line-height: 1.6;
                    }
                    
                    .tiptap li p {
                        margin: 0;
                    }
                    
                    .tiptap code {
                        background: #f0f0f0;
                        color: #d73a49;
                        padding: 0.2em 0.4em;
                        border-radius: 3px;
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        font-size: 0.9em;
                    }
                    
                    .tiptap pre {
                        background: #f6f8fa;
                        border: 1px solid #e1e4e8;
                        border-radius: 6px;
                        padding: 1em;
                        overflow-x: auto;
                        margin: 1em 0;
                    }
                    
                    .tiptap pre code {
                        background: transparent;
                        color: inherit;
                        padding: 0;
                        font-size: 0.9em;
                    }
                    
                    .tiptap blockquote {
                        border-left: 4px solid #0066cc;
                        padding-left: 1em;
                        margin: 1em 0;
                        color: #555;
                        font-style: italic;
                        opacity: 0.8;
                    }
                    
                    .tiptap a {
                        color: #0066cc;
                        text-decoration: underline;
                        cursor: pointer;
                    }
                    
                    .tiptap a:hover {
                        color: #0052a3;
                    }
                    
                    .tiptap img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 6px;
                        margin: 1em 0;
                        border: 1px solid #e1e4e8;
                    }
                    
                    .tiptap hr {
                        margin: 1em 0;
                        border: none;
                        border-top: 2px solid #e1e4e8;
                    }
                `}</style>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
