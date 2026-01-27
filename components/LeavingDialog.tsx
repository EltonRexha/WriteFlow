type LeavingDialogProps = {
  isOpen: boolean;
  yesCallback: () => void;
  noCallback: () => void;
};

export const LeavingDialog = ({
  isOpen,
  yesCallback,
  noCallback,
}: LeavingDialogProps) => {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">The data will be lost.</h3>
        <p className="py-4">Are you sure you want to leave the page?</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => noCallback()}>
            No
          </button>
          <button className="btn btn-primary" onClick={() => yesCallback()}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};
