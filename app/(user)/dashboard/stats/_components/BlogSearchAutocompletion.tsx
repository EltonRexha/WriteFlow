'use client';
import { useToast } from '@/components/ToastProvider';
import { useBlogAutocomplete } from '@/hooks/queries/blog';
import { isActionError } from '@/types/ActionError';
import React, { useEffect, useState } from 'react';

const BlogSearchAutocompletion = React.memo(function BlogSearchAutocompletion({
  title,
  isFocused,
  setCurrentBlog,
}: {
  title: string;
  isFocused: boolean;
  setCurrentBlog: ({ id, title }: { id: string; title: string }) => void;
}) {
  const [blogs, setBlogs] = useState<
    {
      title: string;
      id: string;
      imageUrl: string;
      description: string;
      createdAt: string | Date;
    }[]
  >([]);

  const { addToast } = useToast();
  const { data: blogsByTitle, isError } = useBlogAutocomplete({ title });

  useEffect(() => {
    if (!isFocused) {
      setBlogs([]);
      return;
    }

    if (isError) {
      addToast('could not fetch blogs', 'error');
      setBlogs([]);
      return;
    }

    if (!blogsByTitle) {
      return;
    }

    if (isActionError(blogsByTitle)) {
      addToast('could not fetch blogs', 'error');
      setBlogs([]);
      return;
    }

    setBlogs(blogsByTitle);
  }, [title, blogsByTitle, isError, addToast, isFocused]);

  return (
    <div className="w-full">
      {blogs.length > 0 && (
        <div className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-lg">
          <div className="max-h-[280px] overflow-y-auto">
            {blogs.map((blog) => (
              <button
                key={blog.id}
                type="button"
                onMouseDown={() => {
                  setCurrentBlog({ id: blog.id, title: blog.title });
                  setBlogs([]);
                }}
                className="w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-base-200/60 active:bg-base-200 border-b border-base-300 last:border-b-0"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-base-content">{blog.title}</div>
                  </div>
                  <div className="shrink-0 text-xs text-base-content/60">
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    })}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default BlogSearchAutocompletion;
