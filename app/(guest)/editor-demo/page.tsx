"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import MenuBar from "@/components/textEditor/_components/MenuBar";
import { TIP_TAP_EXTENSIONS } from "@/libs/TipTapExtensions";

const DEMO_CONTENT = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "WriteFlow" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "A modern, open-source blogging platform built with cutting-edge web technologies. WriteFlow leverages the power of Next.js 15 for server-side rendering and optimal performance, TypeScript for type safety and maintainability, and Tailwind CSS for responsive, utility-first styling.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Technology Stack" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Next.js 15 - React framework with App Router and server components",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "TypeScript - Static typing for enhanced developer experience",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Tailwind CSS - Utility-first CSS framework for rapid UI development",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Prisma - Modern database toolkit for type-safe database access",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "TipTap - Rich text editor built on ProseMirror",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "NextAuth.js - Authentication solution for Next.js applications",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The platform combines server-side rendering with client-side interactivity, delivering exceptional performance and user experience. Built with modern development practices and a focus on scalability and maintainability.",
        },
      ],
    },
  ],
};

export default function EditorDemo() {
  const editor = useEditor({
    extensions: TIP_TAP_EXTENSIONS,
    content: DEMO_CONTENT,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "max-w-[82ch] px-2 sm:px-5 m-auto lg:py-4 py-10 focus:outline-none focus:ring-0 min-h-[90vh] text-pretty",
      },
    },
  });

  return (
    <div
      className="min-h-screen bg-base-100"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
