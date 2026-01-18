import { SquareChartGantt } from 'lucide-react';
import React from 'react';

const ManageModalBtn = ({ manageModalId }: { manageModalId: string }) => {
  return (
    <button
      className=""
      onClick={() => {
        const modalElement = document.getElementById(
          manageModalId
        ) as HTMLDialogElement;
        if (modalElement) {
          modalElement.showModal();
        }
      }}
    >
      <SquareChartGantt className="h-4 w-4" />
      Manage
    </button>
  );
};

export default ManageModalBtn;
