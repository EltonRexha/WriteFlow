'use client';
import React from 'react';
import { generateHTML } from '@tiptap/core';
import { TipTapExtensions } from '@/app/components/textEditor/TextEditor';
import { useMounted } from '@/hooks/useMounted';

const BlogContent = ({ content }: { content: string }) => {
  const mounted = useMounted();
  if (!mounted) {
    return <Skeleton />;
  }

  const html = generateHTML(JSON.parse(content), TipTapExtensions);

  return <div dangerouslySetInnerHTML={{ __html: html }} className="tiptap" />;
};

const Skeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Title-like skeleton */}
      <div className="skeleton h-8 w-3/4"></div>
      <div className="skeleton h-8 w-1/2"></div>

      {/* Paragraph-like skeletons */}
      <div className="space-y-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-3/4"></div>
      </div>

      {/* Image-like skeleton */}
      <div className="skeleton h-64 w-full rounded-lg"></div>

      {/* More paragraph-like skeletons */}
      <div className="space-y-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-2/3"></div>
      </div>

      {/* Code block-like skeleton */}
      <div className="skeleton h-32 w-full bg-base-300 rounded-lg"></div>

      {/* Final paragraph-like skeletons */}
      <div className="space-y-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-4/5"></div>
        <div className="skeleton h-4 w-3/4"></div>
      </div>
    </div>
  );
};

export default BlogContent;
