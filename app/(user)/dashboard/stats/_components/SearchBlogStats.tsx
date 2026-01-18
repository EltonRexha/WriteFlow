'use client';
import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDebounce } from '@uidotdev/usehooks';
import BlogSearchAutocompletion from './BlogSearchAutocompletion';
import dynamic from 'next/dynamic';

const BlogStats = dynamic(() => import('./BlogStats'), {
  ssr: true,
});

const ONCHANGE_DEBOUNCE_DELAY = 500;

interface FormInput {
  search: string;
}

const SearchBlogStats = () => {
  const { register, watch, setValue } = useForm<FormInput>();
  const [currentBlog, setCurrentBlog] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const searchValue = watch('search');
  const search = useDebounce(searchValue, ONCHANGE_DEBOUNCE_DELAY);

  function setCurrentBlogFn(blog: { id: string; title: string }) {
    setValue('search', '');
    setCurrentBlog(blog);
  }

  return (
    <div className="mt-5 space-y-10">
      <div className="space-y-2 text-base-content/80">
        <h1>Search blog</h1>
        <form>
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow"
              placeholder="Title"
              {...register('search')}
            />
          </label>
        </form>
      </div>
      <BlogSearchAutocompletion
        title={search}
        setCurrentBlog={setCurrentBlogFn}
      />
      {currentBlog && (
        <BlogStats blogId={currentBlog?.id} title={currentBlog?.title} />
      )}
    </div>
  );
};

export default SearchBlogStats;
