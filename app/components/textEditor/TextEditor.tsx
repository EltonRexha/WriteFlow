'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import MenuBar from './_components/MenuBar';
import Image from '@tiptap/extension-image';
import { isMacOs } from 'react-device-detect';
import { all, createLowlight } from 'lowlight';
const INITIAL_CONTENT = 'Example Text';

const lowlight = createLowlight(all);

const TextEditor = ({ onUpdate }: { onUpdate: (content: string) => void }) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          'max-w-[82ch] px-2 sm:px-5 m-auto lg:py-4 py-10 focus:outline-none focus:ring-0 min-h-[90vh] text-pretty',
      },
    },
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: 'language-',
        defaultLanguage: 'html',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'm-auto',
        },
      }),
      Highlight,
    ],
    onUpdate: ({ editor }) => {
      const content = JSON.stringify(editor.getJSON());
      onUpdate(content);
    },
    onCreate: ({ editor }) => {
      const content = JSON.stringify(editor.getJSON());
      onUpdate(content);
    },
    content: INITIAL_CONTENT,
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {editor?.isActive('codeBlock') && (
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
