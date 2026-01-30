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
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [activeCodeLanguage, setActiveCodeLanguage] = useState<string>("html");
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
      // Mark editor as ready after content is set
      setIsEditorReady(true);
    },
    content: initialContent,
  });

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      if (!editor.isActive("codeBlock")) {
        return;
      }

      const attrs = editor.getAttributes("codeBlock") as { language?: string };
      const lang = typeof attrs.language === "string" && attrs.language ? attrs.language : "html";
      setActiveCodeLanguage(lang);
    };

    update();
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  useEffect(() => {
    if (debouncedEditorContent) {
      onUpdate(debouncedEditorContent);
    }
  }, [debouncedEditorContent, onUpdate]);

  // Show loading state until editor is ready
  if (!editor || !isEditorReady) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {editor?.isActive("codeBlock") && (
        <>
          <div className="absolute bottom-2 left-2 p-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Language</span>
              <select
                className="select select-sm select-bordered bg-base-100"
                value={activeCodeLanguage}
                onChange={(e) => {
                  const lang = e.target.value;
                  setActiveCodeLanguage(lang);
                  editor.chain().focus().updateAttributes("codeBlock", { language: lang }).run();
                }}
              >
                <option value="plaintext">Plain</option>
                <option value="bash">Bash</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="javascript">JavaScript</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
                <option value="python">Python</option>
                <option value="sql">SQL</option>
                <option value="typescript">TypeScript</option>
                <option value="tsx">TSX</option>
              </select>
            </div>
          </div>

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
        </>
      )}
    </>
  );
};

export default EditTextEditor;
