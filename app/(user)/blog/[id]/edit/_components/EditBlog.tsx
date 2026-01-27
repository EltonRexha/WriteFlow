"use client";
import React, { useEffect, useState } from "react";
import { useBlog, useUpdateBlogContent } from "@/hooks/queries/blog";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import EditTextEditor from "./EditTextEditor";
import { isResponseError } from "@/types/guards/isResponseError";
import { Save, Loader2 } from "lucide-react";
import { isApiErrorResponse } from "@/types/guards/isApiErrorResponse";

interface EditBlogProps {
  blogId: string;
}

const EditBlog = ({ blogId }: EditBlogProps) => {
  const [blogContent, setBlogContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialContent, setInitialContent] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  // Fetch blog data
  const { data, isLoading, isError } = useBlog({ id: blogId });

  // Initialize content when data is loaded
  useEffect(() => {
    if (data && !isResponseError(data)) {
      const content = data.data.BlogContent.content as string;
      setInitialContent(content);
      setBlogContent(content);
    }
  }, [data]);

  // Check for errors
  useEffect(() => {
    if (isError || (data && isResponseError(data))) {
      addToast("Failed to load blog", "error");
      router.push("/dashboard/blogs");
    }
  }, [isError, data, addToast, router]);

  // Mutation to save blog content
  const mutation = useUpdateBlogContent();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (!isResponseError(mutation.data)) {
        addToast("Blog content saved successfully", "success");
        setHasUnsavedChanges(false);
        setInitialContent(blogContent);
        router.push(`/blog/${blogId}`);
      } else {
        addToast("Failed to save blog content", "error");
      }
    }
  }, [
    mutation.isSuccess,
    mutation.data,
    addToast,
    blogContent,
    router,
    blogId,
  ]);

  useEffect(() => {
    if (isApiErrorResponse(mutation.error)) {
      const errorData = mutation.error.response.data;
      if (isResponseError(errorData)) {
        addToast(errorData.error.message, "error");
        return;
      }

      addToast("An error occurred while saving", "error");
    }
  }, [mutation.isError, mutation.error, addToast]);

  // Handle content updates
  function onUpdate(content: string) {
    setBlogContent(content);
    setHasUnsavedChanges(content !== initialContent);
  }

  // Handle save
  function handleSave() {
    if (!blogContent || blogContent === initialContent) {
      addToast("No changes to save", "info");
      return;
    }
    mutation.mutate({ blogId, content: blogContent });
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
      {/* Save Button Fixed at Top */}
      <div className="sticky top-0 py-3 px-4 mb-4">
        <div className="max-w-[82ch] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="badge badge-warning badge-sm">
                Unsaved changes
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || mutation.isPending}
            className="btn btn-primary btn-sm"
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
        </div>
      </div>

      {/* Editor */}
      {initialContent && (
        <EditTextEditor onUpdate={onUpdate} initialContent={initialContent} />
      )}
    </>
  );
};

export default EditBlog;
