"use client";
import React from "react";

interface PublishDraftBtnProps {
  disabled?: boolean;
}

const PublishDraftBtn = ({ disabled }: PublishDraftBtnProps) => {
  return (
    <button
      className="btn btn-sm btn-soft btn-primary"
      disabled={disabled}
      onClick={() =>
        (
          document.getElementById("publishDraftModal") as HTMLDialogElement
        )!.showModal()
      }
    >
      Publish
    </button>
  );
};

export default PublishDraftBtn;
