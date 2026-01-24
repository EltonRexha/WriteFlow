"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import MenuBar from '@/components/textEditor/_components/MenuBar';
import { TIP_TAP_EXTENSIONS } from '@/libs/TipTapExtensions';

const DEMO_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Welcome to WriteFlow' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Experience the future of content creation with our powerful, intuitive editor. WriteFlow combines the best of modern technology with a seamless writing experience that makes content creation a joy rather than a chore.' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Why Choose WriteFlow?' }]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: '🚀 Lightning-fast performance that never slows you down' }] }
          ]
        },
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: '✨ Beautiful, distraction-free interface that helps you focus on what matters most - your writing' }] }
          ]
        },
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: '🔧 Advanced formatting tools with TipTap editor integration for professional results' }] }
          ]
        },
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: '💾 Auto-save functionality that ensures you never lose your precious work' }] }
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Start writing your story today. Your ideas deserve the best platform, and WriteFlow is here to help you bring them to life with style and ease.' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Key Features' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'WriteFlow offers a comprehensive suite of tools designed for modern content creators. Whether you\'re a blogger, technical writer, or creative professional, our platform adapts to your unique needs.' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Rich Text Editing' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Our advanced TipTap editor provides you with all the formatting options you need, from basic text styling to complex layouts. Create beautiful documents with headings, lists, quotes, code blocks, and more.' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Seamless Integration' }]
    },
    {
      'type': 'paragraph',
      'content': [
        { 'type': 'text', 'text': 'Built with modern technologies like Next.js, TypeScript, and Tailwind CSS, WriteFlow integrates seamlessly into your existing workflow. Export your work in multiple formats and collaborate with ease.' }
      ]
    },
    {
      'type': 'heading',
      'attrs': { level: 3 },
      'content': [{ 'type': 'text', 'text': 'Cloud Storage' }]
    },
    {
      'type': 'paragraph',
      'content': [
        { 'type': 'text', 'text': 'Your work is automatically saved to the cloud, ensuring you can access it from anywhere, on any device. Never worry about losing your progress or managing multiple versions of your documents.' }
      ]
    },
    {
      'type': 'paragraph',
      'content': [
        { 'type': 'text', 'text': 'Join thousands of writers who have already discovered the WriteFlow difference. Start your journey today and experience writing the way it should be - intuitive, powerful, and enjoyable.' }
      ]
    }
  ]
};

export default function EditorDemo() {
  const editor = useEditor({
    extensions: TIP_TAP_EXTENSIONS,
    content: DEMO_CONTENT,
    editable: false,
    editorProps: {
      attributes: {
        class: 'max-w-[82ch] px-2 sm:px-5 m-auto lg:py-4 py-10 focus:outline-none focus:ring-0 min-h-[90vh] text-pretty',
      },
    },
  });

  return (
    <div className="min-h-screen bg-base-100">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
