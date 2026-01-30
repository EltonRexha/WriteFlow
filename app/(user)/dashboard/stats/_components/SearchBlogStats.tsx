'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search Blog Analytics
        </h3>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-base-content/40" />
          </div>
          <input
            type="search"
            className="input input-bordered w-full pl-10 pr-4 py-3 bg-base-200/50 focus:bg-base-100 transition-colors duration-200"
            placeholder="Search for a blog title..."
            {...register('search')}
          />
        </div>
      </div>

      {/* Autocomplete Results */}
      <BlogSearchAutocompletion
        title={search || ''}
        setCurrentBlog={setCurrentBlogFn}
      />

      {/* Selected Blog Stats */}
      {currentBlog && (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
          <BlogStats blogId={currentBlog?.id} title={currentBlog?.title} />
        </div>
      )}
    </div>
  );
};

export default SearchBlogStats;
