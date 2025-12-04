import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    disabled?: boolean;
}

const lowlight = createLowlight();

export default function TiptapEditor({ content, onChange, disabled = false }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image.configure({
                allowBase64: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: content || '',
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;

        // Only update if content has changed externally (not from user typing)
        if (content && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    const handleLinkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const url = window.prompt('Enter URL:');
        if (url && editor) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const url = window.prompt('Enter image URL:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="rounded border bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('code') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <div className="mx-1 border-r"></div>

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    disabled={disabled}
                    className="h-8 px-2 text-xs"
                >
                    H1
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    disabled={disabled}
                    className="h-8 px-2 text-xs"
                >
                    H2
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    disabled={disabled}
                    className="h-8 px-2 text-xs"
                >
                    H3
                </Button>

                <div className="mx-1 border-r"></div>

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBulletList().run();
                    }}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleOrderedList().run();
                    }}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    disabled={disabled}
                    className="h-8 px-2 text-xs"
                >
                    Code
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="mx-1 border-r"></div>

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('link') ? 'default' : 'outline'}
                    onClick={handleLinkClick}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleImageClick}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <div className="min-h-[300px] max-w-none overflow-auto p-4">
                <style>{`
                    .tiptap {
                        outline: none;
                    }
                    .tiptap h1 {
                        font-size: 2em;
                        font-weight: bold;
                        margin: 0.67em 0;
                    }
                    .tiptap h2 {
                        font-size: 1.5em;
                        font-weight: bold;
                        margin: 0.75em 0;
                    }
                    .tiptap h3 {
                        font-size: 1.17em;
                        font-weight: bold;
                        margin: 0.83em 0;
                    }
                    .tiptap ul, .tiptap ol {
                        padding-left: 1.5em;
                        margin: 1em 0;
                    }
                    .tiptap li {
                        margin: 0.5em 0;
                    }
                    .tiptap blockquote {
                        border-left: 4px solid #ddd;
                        padding-left: 1em;
                        margin: 1em 0;
                        color: #666;
                        font-style: italic;
                    }
                    .tiptap code {
                        background: #f0f0f0;
                        padding: 0.2em 0.4em;
                        border-radius: 3px;
                        font-family: monospace;
                    }
                    .tiptap pre {
                        background: #f5f5f5;
                        border-radius: 5px;
                        padding: 1em;
                        overflow-x: auto;
                        margin: 1em 0;
                    }
                    .tiptap pre code {
                        background: transparent;
                        padding: 0;
                    }
                    .tiptap a {
                        color: #0066cc;
                        text-decoration: underline;
                    }
                    .tiptap img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 5px;
                        margin: 1em 0;
                    }
                `}</style>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
