import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

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
        <div className="border rounded p-2 min-h-[200px] bg-white">
            <EditorContent editor={editor} />
        </div>
    );
}
