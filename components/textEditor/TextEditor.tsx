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
    onUpdate(debouncedEditorContent);
  }, [debouncedEditorContent, onUpdate]);

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

export default TextEditor;
