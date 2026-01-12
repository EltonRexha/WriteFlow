'use client';
import { getBlog } from '@/libs/api/blog';
import ManageBlogDialogForm from './ManageBlogDialogForm';
import { useQuery } from '@tanstack/react-query';
import { isActionError } from '@/types/ActionError';
import type { GetBlogResponse } from '@/libs/api/blog';

const ManageBlogDialog = ({ blogId }: { blogId: string }) => {
  const { data: blog } = useQuery<GetBlogResponse>({
    queryKey: ['blog', blogId],
    queryFn: () => getBlog(blogId),
    retry: false,
  });

  if (!blog || isActionError(blog)) {
    return null;
  }

  return <ManageBlogDialogForm blogId={blogId} blog={blog} />;
};

export default ManageBlogDialog;
