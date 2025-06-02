'use client';
import { getBlog } from '@/server-actions/blogs/action';
import ManageBlogDialogForm from './ManageBlogDialogForm';
import { useEffect, useState } from 'react';

const ManageBlogDialog = ({ blogId }: { blogId: string }) => {
  const [blog, setBlog] = useState<Awaited<ReturnType<typeof getBlog>>>();
  useEffect(() => {
    async function fetchBlog() {
      const blog = await getBlog(blogId);
      setBlog(blog);
    }

    fetchBlog();
  }, [blogId]);

  if (!blog) {
    return null;
  }

  return <ManageBlogDialogForm blogId={blogId} blog={blog} />;
};

export default ManageBlogDialog;
