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
        content,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content && content !== editor.getHTML()) {
            editor.commands.setContent(content);
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
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
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
            <div className="min-h-[300px] prose prose-sm max-w-none p-4 overflow-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
