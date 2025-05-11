'use client';
import React from 'react';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import ImageExt from '@tiptap/extension-image';
import { useMounted } from '@/hooks/useMounted';

const BlogContent = ({ content }: { content: string }) => {
  const mounted = useMounted();
  if (!mounted) {
    return null;
  }
  const html = generateHTML(JSON.parse(content), [
    StarterKit,
    CodeBlockLowlight,
    TextAlign,
    ImageExt,
    Highlight,
  ]);

  return <div dangerouslySetInnerHTML={{ __html: html }} className="tiptap" />;
};

export default BlogContent;
