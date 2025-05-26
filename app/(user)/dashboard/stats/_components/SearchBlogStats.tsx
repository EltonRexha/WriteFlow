'use client';
import React from 'react';
import BlogStats from './BlogStats';
import { useForm } from 'react-hook-form';
import { useDebounce } from '@uidotdev/usehooks';
import BlogSearchAutocompletion from './BlogSearchAutocompletion';

const ONCHANGE_DEBOUNCE_DELAY = 500;

interface FormInput {
  search: string;
  blogId: string;
}

const SearchBlogStats = () => {
  const { register, handleSubmit, watch } = useForm<FormInput>();
  const searchValue = watch('search');
  const search = useDebounce(searchValue, ONCHANGE_DEBOUNCE_DELAY);
  async function onSubmit(data: FormInput) {}

  return (
    <div className="mt-5 ">
      <div className="space-y-2 text-base-content/80">
        <h1>Search blog</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
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
      <BlogSearchAutocompletion title={search} />
      <BlogStats />
    </div>
  );
};

export default SearchBlogStats;
