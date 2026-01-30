"use client";

import { useToast } from "@/components/ToastProvider";
import { useDeleteBlog, blogQueryKeys } from "@/hooks/queries/blog";
import { recommendationQueryKeys } from "@/hooks/queries/recommendation";
import { statsQueryKeys } from "@/hooks/queries/stats";
import { isActionError } from "@/types/ActionError";
import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const DeleteBtn = ({ blogId, onDeletingChange }: { blogId: string; onDeletingChange?: (isDeleting: boolean) => void }) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useDeleteBlog();

  useEffect(() => {
    onDeletingChange?.(mutation.isPending);
  }, [mutation.isPending, onDeletingChange]);

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) {
        addToast(mutation.data.error.message, "error");
        return;
      }
      addToast(mutation.data.message, "success");
      // Invalidate all blog-related queries
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardUserBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["userBlogs"] });
      // Invalidate recommendation queries to remove deleted blog from feeds
      queryClient.invalidateQueries({ queryKey: recommendationQueryKeys.all });
      // Invalidate stats queries since blog count and stats will change
      queryClient.invalidateQueries({ queryKey: statsQueryKeys.all });
      
      // Close the modal by finding and clicking the dialog's close button
      const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
    }
  }, [mutation.isSuccess, mutation.data, addToast, queryClient]);

  useEffect(() => {
    if (mutation.isError) {
      addToast("Something went wrong deleting blog", "error");
    }
  }, [mutation.isError, addToast]);

  return (
    <button
      className="btn btn-error"
      onClick={async () => {
        mutation.mutate(blogId);
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
