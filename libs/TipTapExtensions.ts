import { Extensions } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import hljs from 'highlight.js';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import { all, createLowlight } from 'lowlight';

const lowlight = createLowlight(all);

export const TIP_TAP_EXTENSIONS: Extensions = [
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