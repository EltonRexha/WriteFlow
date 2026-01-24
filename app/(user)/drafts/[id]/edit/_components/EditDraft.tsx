"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDraft, updateDraft } from "@/libs/api/drafts";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import EditDraftEditor from "./EditDraftEditor";
import { isResponseError } from "@/types/guards/isResponseError";
import { Save, Loader2 } from "lucide-react";
import PublishDraftDialog from "./PublishDraftDialog";
import PublishDraftBtn from "./PublishDraftBtn";

interface EditDraftProps {
  draftId: string;
}

const EditDraft = ({ draftId }: EditDraftProps) => {
  const [draftContent, setDraftContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialContent, setInitialContent] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  // Fetch draft data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["draft", draftId],
    queryFn: () => getDraft(draftId),
    retry: false,
  });

  // Initialize content when data is loaded
  useEffect(() => {
    if (data && !isResponseError(data)) {
      const content = data.BlogContent.content as string;
      setInitialContent(content);
      setDraftContent(content);
    }
  }, [data]);

  // Check for errors
  useEffect(() => {
    if (isError || (data && isResponseError(data))) {
      addToast("Failed to load draft", "error");
      router.push("/dashboard/drafts");
    }
  }, [isError, data, addToast, router]);

  // Mutation to save draft content
  const mutation = useMutation({
    mutationFn: (content: string) => updateDraft(draftId, content),
    onSuccess: (response) => {
      if (!isResponseError(response)) {
        addToast("Draft saved successfully", "success");
        setHasUnsavedChanges(false);
        setInitialContent(draftContent);
      } else {
        addToast("Failed to save draft", "error");
      }
    },
    onError: () => {
      addToast("An error occurred while saving", "error");
    },
  });

  // Handle content updates
  function onUpdate(content: string) {
    setDraftContent(content);
    setHasUnsavedChanges(content !== initialContent);
  }

  // Handle save
  function handleSave() {
    if (!draftContent || draftContent === initialContent) {
      addToast("No changes to save", "info");
      return;
    }
    mutation.mutate(draftContent);
  }

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data || isResponseError(data)) {
    return null;
  }

  return (
    <>
      {/* Action Buttons Fixed at Top */}
      <div className="sticky top-0 py-3 px-4 mb-4">
        <div className="max-w-[82ch] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="badge badge-warning badge-sm">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || mutation.isPending}
              className="btn btn-secondary btn-ghost btn-sm"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </button>
            <PublishDraftBtn disabled={hasUnsavedChanges} />
          </div>
        </div>
      </div>

      {/* Editor */}
      {initialContent && (
        <EditDraftEditor onUpdate={onUpdate} initialContent={initialContent} />
      )}

      {/* Publish Modal */}
      <PublishDraftDialog draftId={draftId} draftContent={draftContent} />
    </>
  );
};

export default EditDraft;
