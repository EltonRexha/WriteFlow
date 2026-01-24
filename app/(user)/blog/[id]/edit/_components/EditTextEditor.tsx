"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import MenuBar from "@/components/textEditor/_components/MenuBar";
import { isMacOs } from "react-device-detect";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { TIP_TAP_EXTENSIONS } from "@/libs/TipTapExtensions";

const ONCHANGE_DEBOUNCE_DELAY = 2000;

interface EditTextEditorProps {
  onUpdate: (content: string) => void;
  initialContent: string;
}

const EditTextEditor = ({ onUpdate, initialContent }: EditTextEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const debouncedEditorContent = useDebounce(content, ONCHANGE_DEBOUNCE_DELAY);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "max-w-[82ch] px-2 sm:px-5 m-auto lg:py-4 py-10 focus:outline-none focus:ring-0 min-h-[90vh] text-pretty",
      },
    },
    extensions: TIP_TAP_EXTENSIONS,
    onUpdate: ({ editor }) => {
      const newContent = JSON.stringify(editor.getJSON());
      setContent(newContent);
    },
    onCreate: ({ editor }) => {
      // Initialize with existing content
      if (initialContent) {
        try {
          const parsedContent = JSON.parse(initialContent);
          editor.commands.setContent(parsedContent);
        } catch (error) {
          console.error("Failed to parse initial content:", error);
        }
      }
    },
    content: initialContent,
  });

  useEffect(() => {
    if (debouncedEditorContent) {
      onUpdate(debouncedEditorContent);
    }
  }, [debouncedEditorContent, onUpdate]);

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {editor?.isActive("codeBlock") && (
        <div className="absolute bottom-2 right-2 p-2">
          <p className="font-semibold">To Get Out Of Code Use</p>
          {isMacOs ? (
            <div>
              <kbd className="kbd">⌘</kbd> + <kbd className="kbd">ENTER</kbd>
            </div>
          ) : (
            <div>
              <kbd className="kbd">CTRL</kbd> + <kbd className="kbd">ENTER</kbd>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EditTextEditor;
