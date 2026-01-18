'use client';

import { useToast } from '@/components/ToastProvider';
import { deleteDraft } from '@/libs/api/drafts';
import { isActionError } from '@/types/ActionError';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const DeleteBtn = ({ draftId }: { draftId: string }) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteDraft(draftId),
    onSuccess: (deleteResponse) => {
      if (isActionError(deleteResponse)) {
        addToast(deleteResponse.error.message, 'error');
        return;
      }

      addToast(deleteResponse.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['dashboardDrafts'] });
    },
    onError: () => {
      addToast('Something went wrong deleting draft', 'error');
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
