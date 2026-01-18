"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import MenuBar from "./_components/MenuBar";
import { isMacOs } from "react-device-detect";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { TIP_TAP_EXTENSIONS } from "@/libs/TipTapExtensions";

export const INITIAL_CONTENT = "Example Text";
const ONCHANGE_DEBOUNCE_DELAY = 2000;

const TextEditor = ({ onUpdate }: { onUpdate: (content: string) => void }) => {
  const [content, setContent] = useState(INITIAL_CONTENT);

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
      if (debouncedEditorContent) {
        const content = JSON.stringify(editor.getJSON());
        setContent(content);
      }
    },
    onCreate: ({ editor }) => {
      const content = JSON.stringify(editor.getJSON());
      onUpdate(content);
    },
    content: INITIAL_CONTENT,
  });

  useEffect(() => {
    onUpdate(debouncedEditorContent);
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

export default TextEditor;
