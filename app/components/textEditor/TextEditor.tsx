'use client';

import {
  useEditor,
  EditorContent,
  Extensions,
  mergeAttributes,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import MenuBar from './_components/MenuBar';
import Image from '@tiptap/extension-image';
import { isMacOs } from 'react-device-detect';
import { all, createLowlight } from 'lowlight';
import hljs from 'highlight.js';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

const INITIAL_CONTENT = 'Example Text';
//Every 5 seconds change the conte
const ONCHANGE_DEBOUNCE_DELAY = 5000;
const lowlight = createLowlight(all);

export const TipTapExtensions: Extensions = [
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
  }).extend({
    renderHTML({ node, HTMLAttributes }) {
      const gen = hljs.highlight(node.textContent, {
        language: node.attrs.language,
      }).value;
      const doc = document;
      const pre = doc.createElement('pre');
      const preAttrs = mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes
      );
      for (const key in preAttrs) {
        pre.setAttribute(key, preAttrs[key]);
      }
      const code = doc.createElement('code');
      if (node.attrs.language) {
        code.classList.add(
          this.options.languageClassPrefix + node.attrs.language
        );
      }
      // @ts-nocheck
      pre.appendChild(code);
      code.innerHTML = gen;
      return pre as HTMLElement;
    },
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
];

const TextEditor = ({ onUpdate }: { onUpdate: (content: string) => void }) => {
  const [content, setContent] = useState(INITIAL_CONTENT);

  const debouncedEditorContent = useDebounce(content, ONCHANGE_DEBOUNCE_DELAY);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          'max-w-[82ch] px-2 sm:px-5 m-auto lg:py-4 py-10 focus:outline-none focus:ring-0 min-h-[90vh] text-pretty',
      },
    },
    extensions: TipTapExtensions,
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
