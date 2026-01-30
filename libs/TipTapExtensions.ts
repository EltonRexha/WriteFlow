import { Extensions, Extension } from '@tiptap/core';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import { all, createLowlight } from 'lowlight';

const lowlight = createLowlight(all);

const PreventCodeBlockBackspaceTrap = Extension.create({
  name: 'preventCodeBlockBackspaceTrap',
  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { state, dispatch } = this.editor.view;
        const { selection } = state;

        if (!selection.empty) {
          return false;
        }

        const { $from } = selection;

        if ($from.parent.type.name !== 'paragraph' || $from.parentOffset !== 0) {
          return false;
        }

        if ($from.depth < 1) {
          return false;
        }

        const parent = $from.node($from.depth - 1);
        const index = $from.index($from.depth - 1);

        if (index <= 0) {
          return false;
        }

        const prevNode = parent.child(index - 1);

        if (prevNode.type.name !== 'codeBlock') {
          return false;
        }

        const posBefore = $from.before($from.depth);
        const from = posBefore - prevNode.nodeSize;
        const to = posBefore;

        dispatch(state.tr.delete(from, to).scrollIntoView());
        return true;
      },
    };
  },
});

export const TIP_TAP_EXTENSIONS: Extensions = [
  StarterKit.configure({
    codeBlock: false,
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
  PreventCodeBlockBackspaceTrap,
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