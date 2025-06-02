import { useToast } from '@/app/components/ToastProvider';
import { deleteBlog } from '@/server-actions/blogs/action';
import { isActionError } from '@/types/ActionError';
import React from 'react';

const DeleteBtn = ({ blogId }: { blogId: string }) => {
  const { addToast } = useToast();

  return (
    <button
      className="btn btn-error"
      onClick={async () => {
        const deleteResponse = await deleteBlog({ blogId });

        if (isActionError(deleteResponse)) {
          addToast(deleteResponse.error.message, 'error');
          return;
        }

        addToast(deleteResponse.message, 'success');
      }}
    >
      Delete
    </button>
  );
};

export default DeleteBtn;
