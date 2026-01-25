'use client';

import { useToast } from '@/components/ToastProvider';
import { useDeleteBlog, blogQueryKeys } from '@/hooks/queries/blog';
import { recommendationQueryKeys } from '@/hooks/queries/recommendation';
import { statsQueryKeys } from '@/hooks/queries/stats';
import { isActionError } from '@/types/ActionError';
import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const DeleteBtn = ({ blogId }: { blogId: string }) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useDeleteBlog();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) {
        addToast(mutation.data.error.message, 'error');
        return;
      }
      addToast(mutation.data.message, 'success');
      // Invalidate all blog-related queries
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboardUserBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['userBlogs'] });
      // Invalidate recommendation queries to remove deleted blog from feeds
      queryClient.invalidateQueries({ queryKey: recommendationQueryKeys.all });
      // Invalidate stats queries since blog count and stats will change
      queryClient.invalidateQueries({ queryKey: statsQueryKeys.all });
    }
  }, [mutation.isSuccess, mutation.data, addToast, queryClient]);

  useEffect(() => {
    if (mutation.isError) {
      addToast('Something went wrong deleting blog', 'error');
    }
  }, [mutation.isError, addToast]);

  return (
    <button
      className="btn btn-error"
      onClick={async () => {
        mutation.mutate(blogId);
      }}
    >
      Delete
    </button>
  );
};

export default DeleteBtn;
