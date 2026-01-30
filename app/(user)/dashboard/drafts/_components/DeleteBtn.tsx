'use client';

import { useToast } from '@/components/ToastProvider';
import { useDeleteDraft } from '@/hooks/queries/drafts';
import { isActionError } from '@/types/ActionError';
import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const DeleteBtn = ({ draftId, onDeletingChange }: { draftId: string; onDeletingChange?: (isDeleting: boolean) => void }) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useDeleteDraft();

  useEffect(() => {
    onDeletingChange?.(mutation.isPending);
  }, [mutation.isPending, onDeletingChange]);

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) {
        addToast(mutation.data.error.message, 'error');
        return;
      }
      addToast(mutation.data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['dashboardDrafts'] });
      
      // Close the modal by finding and clicking the dialog's close button
      const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
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
      type="button"
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Deleting...
        </>
      ) : (
        "Delete"
      )}
    </button>
  );
};

export default DeleteBtn;
