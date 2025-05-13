'use client';
import { Save } from 'lucide-react';
import React from 'react';

const CreateDraftBtn = () => {
  return (
    <button
      className="btn btn-sm btn-secondary btn-ghost"
      onClick={() =>
        (document.getElementById(
          'saveDraftModal'
        ) as HTMLDialogElement)!.showModal()
      }
    >
      <Save className="join-item" height={15} width={15} />
      Save
    </button>
  );
};

export default CreateDraftBtn;
