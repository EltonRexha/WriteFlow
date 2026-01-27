"use client";
import React, { useState } from "react";
import TextEditor from "../../../../../components/textEditor/TextEditor";
import CreateDraftDialog from "./CreateDraftDialog";
import CreateBlogDialog from "./CreateBlogDialog";
import { PreventNavigation } from "@/components/PreventNavigation";

const CreateBlog = () => {
  const [blogContent, setBlogContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  function onUpdate(content: string) {
    setBlogContent(content);
    setHasUnsavedChanges(content !== "");
  }

  return (
    <>
      <div className="sticky top-0 py-3 px-4 mb-4">
        <div className="max-w-[82ch] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="badge badge-warning badge-sm">
                Unsaved changes
              </span>
            )}
          </div>
        </div>
      </div>
      <PreventNavigation
        isDirty={hasUnsavedChanges}
        backHref={"/home"}
        resetData={() => setHasUnsavedChanges(false)}
      />
      <TextEditor onUpdate={onUpdate} />
      <CreateDraftDialog blogContent={blogContent} />
      <CreateBlogDialog blogContent={blogContent} />
    </>
  );
};

export default CreateBlog;
