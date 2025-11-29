import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    disabled?: boolean;
}

export default function TiptapEditor({ content, onChange, disabled = false }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    return (
        <div className="min-h-[200px] rounded border bg-white p-2">
            <EditorContent editor={editor} />
        </div>
    );
}
