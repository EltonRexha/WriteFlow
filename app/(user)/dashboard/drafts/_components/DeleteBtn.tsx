'use client';

import { useToast } from '@/components/ToastProvider';
import { useDeleteDraft } from '@/hooks/queries/drafts';
import { isActionError } from '@/types/ActionError';
import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const DeleteBtn = ({ draftId }: { draftId: string }) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useDeleteDraft();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) {
        addToast(mutation.data.error.message, 'error');
        return;
      }
      addToast(mutation.data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['dashboardDrafts'] });
    }
  }, [mutation.isSuccess, mutation.data, addToast, queryClient]);

  useEffect(() => {
    if (mutation.isError) {
      addToast('Something went wrong deleting draft', 'error');
    }
  }, [mutation.isError, addToast]);

  return (
    <button
      className="btn btn-error"
      onClick={async () => {
        mutation.mutate(draftId);
      }}
    >
      Delete
    </button>
  );
};

export default DeleteBtn;
