import type { DraftDto } from '@/libs/api/drafts';
import { format } from 'date-fns';
import { MoreVertical, Edit, Clock, Trash2 } from 'lucide-react';
import DeleteBtn from './DeleteBtn';
import ModalDeleteBtn from './ModalDeleteBtn';
import Link from 'next/link';

const DarkManageCard = ({
  id,
  name,
  updatedAt,
}: DraftDto) => {
  const modalId = `delete-draft-modal-${id}`;

  return (
    <>
      <article className="flex gap-6 py-6 border-b border-base-content/10 bg-base-200/50 p-4 rounded-lg hover:bg-base-200 transition-colors max-w-3xl mx-auto w-full">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="badge badge-warning badge-sm">Draft</div>
            <div className="flex items-center gap-1 text-xs text-base-content/60">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(updatedAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-base-content/60">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(updatedAt), 'h:mm a')}</span>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 line-clamp-2">{name}</h2>
          </div>

          <div className="flex gap-2">
            <Link href={`/drafts/${id}/edit`}>
              <button className="btn btn-primary btn-sm">
                <Edit className="h-4 w-4" />
                Edit
              </button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-square bg-base-200/50 hover:bg-base-200"
            >
              <MoreVertical className="h-4 w-4" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-content/10"
            >
              <li>
                <ModalDeleteBtn modalId={modalId} />
              </li>
            </ul>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-error/10 p-2 rounded-lg">
              <Trash2 className="h-6 w-6 text-error" />
            </div>
            <h3 className="font-bold text-lg">Delete Draft</h3>
          </div>
          <p className="py-4 text-base-content/70">
            Are you sure you want to delete &ldquo;{name}&rdquo;? This action
            cannot be undone and draft cannot be retrieved.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost">Cancel</button>
              <DeleteBtn draftId={id} />
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default DarkManageCard;
