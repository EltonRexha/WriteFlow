'use client';

import { useToast } from '@/components/ToastProvider';
import { deleteBlog } from '@/libs/api/blog';
import { isActionError } from '@/types/ActionError';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const DeleteBtn = ({ blogId }: { blogId: string }) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteBlog(blogId),
    onSuccess: (deleteResponse) => {
      if (isActionError(deleteResponse)) {
        addToast(deleteResponse.error.message, 'error');
        return;
      }

      addToast(deleteResponse.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['userBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardUserBlogs'] });
    },
    onError: () => {
      addToast('Something went wrong deleting blog', 'error');
    },
  });

  return (
    <button
      className="btn btn-error"
      onClick={async () => {
        mutation.mutate();
      }}
    >
      Delete
    </button>
  );
};

export default DeleteBtn;
