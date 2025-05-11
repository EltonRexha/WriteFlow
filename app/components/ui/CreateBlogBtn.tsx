'use client';
import React from 'react';

const CreateBlogBtn = () => {
  return (
    <button
      className="btn btn-sm btn-soft btn-primary"
      onClick={() =>
        (document.getElementById(
          'createBlogModal'
        ) as HTMLDialogElement)!.showModal()
      }
    >
      Publish
    </button>
  );
};

export default CreateBlogBtn;
