import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Undo,
    Redo,
} from 'lucide-react';

interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function TiptapEditor({
    value,
    onChange,
    disabled = false,
    placeholder = "Start writing your product description..."
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: value || `<p>${placeholder}</p>`,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editable: !disabled,
    });

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    return (
        <div className="w-full border rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
                {/* Text Formatting */}
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled || !editor.can().chain().focus().toggleBold().run()}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled || !editor.can().chain().focus().toggleItalic().run()}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Headings */}
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    disabled={disabled}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    disabled={disabled}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Lists */}
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
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
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Alignment */}
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    disabled={disabled}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    disabled={disabled}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    disabled={disabled}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Link */}
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('link') ? 'default' : 'outline'}
                    onClick={addLink}
                    disabled={disabled}
                    title="Add Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Undo/Redo */}
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={disabled || !editor.can().chain().focus().undo().run()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={disabled || !editor.can().chain().focus().redo().run()}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <div className="p-4">
                <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:max-w-none"
                />
            </div>
        </div>
    );
}
