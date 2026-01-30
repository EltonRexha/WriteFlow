'use client';
import { useToast } from '@/components/ToastProvider';
import { useBlogAutocomplete } from '@/hooks/queries/blog';
import { isActionError } from '@/types/ActionError';
import React, { useEffect, useState } from 'react';

const BlogSearchAutocompletion = React.memo(function BlogSearchAutocompletion({
  title,
  setCurrentBlog,
}: {
  title: string;
  setCurrentBlog: ({ id, title }: { id: string; title: string }) => void;
}) {
  const [blogs, setBlogs] = useState<
    {
      title: string;
      id: string;
      imageUrl: string;
      description: string;
    }[]
  >([]);

  const { addToast } = useToast();
  const { data: blogsByTitle, isError } = useBlogAutocomplete({ title });

  useEffect(() => {
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
  }, [title, blogsByTitle, isError, addToast]);

  return (
    <div className="mt-2 w-full">
      {blogs.length > 0 && (
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body p-2 max-h-[400px] overflow-y-auto">
            {blogs.map((blog) => (
              <button
                key={blog.id}
                onClick={() => {
                  setCurrentBlog({ id: blog.id, title: blog.title });
                  setBlogs([]);
                }}
                className="group hover:bg-base-200 p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-start gap-3"
              >
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center opacity-70 group-hover:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  {blog.description && (
                    <p className="text-sm text-base-content/70 mt-1 line-clamp-2 group-hover:text-base-content/80 transition-colors">
                      {blog.description}
                    </p>
                  )}
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
