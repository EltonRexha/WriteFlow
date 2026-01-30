'use client';
import { useBlog } from '@/hooks/queries/blog';
import ManageBlogDialogForm from './ManageBlogDialogForm';
import { isActionError } from '@/types/ActionError';

const ManageBlogDialog = ({ blogId }: { blogId: string }) => {
  const { data: blog, isLoading } = useBlog({ id: blogId });

  if (isLoading) return null;

  if (!blog || isActionError(blog)) {
    return null;
  }

  return <ManageBlogDialogForm blogId={blogId} blog={blog} />;
};

export default ManageBlogDialog;
