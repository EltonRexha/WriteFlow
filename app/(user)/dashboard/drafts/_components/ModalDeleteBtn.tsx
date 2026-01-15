import { Trash2 } from 'lucide-react';
import React from 'react';

const ModalDeleteBtn = ({ modalId }: { modalId: string }) => {
  return (
    <button
      className="text-error"
      onClick={() => {
        const modalElement = document.getElementById(
          modalId
        ) as HTMLDialogElement;
        if (modalElement) {
          modalElement.showModal();
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  );
};

export default ModalDeleteBtn;
