'use client';
import { useBlog } from '@/hooks/queries/blog';
import ManageBlogDialogForm from './ManageBlogDialogForm';
import { isActionError } from '@/types/ActionError';
import type { GetBlogResponse } from '@/libs/api/services/blog';

const ManageBlogDialog = ({ blogId }: { blogId: string }) => {
  const { data: blog } = useBlog({ id: blogId });

  if (!blog || isActionError(blog)) {
    return null;
  }

  return <ManageBlogDialogForm blogId={blogId} blog={blog} />;
};

export default ManageBlogDialog;
