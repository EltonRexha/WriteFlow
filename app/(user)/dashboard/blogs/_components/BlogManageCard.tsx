import type { DisplayBlog } from '@/libs/api/blog';
import { format } from 'date-fns';
import { MoreVertical, ThumbsDown, ThumbsUp, Edit } from 'lucide-react';
import Image from 'next/image';
import ManageBlogDialog from './ManageBlogDialog';
import DeleteBtn from './DeleteBtn';
import ModalDeleteBtn from './ModalDeleteBtn';
import ManageModalBtn from './ManageModalBtn';

const BlogManageCard = ({
  id,
  title,
  description,
  imageUrl,
  Author,
  createdAt,
  _count,
}: DisplayBlog) => {
  const modalId = `delete-modal-${id}`;
  const manageModalId = `edit-modal-${id}`;

  return (
    <>
      <article className="flex gap-6 py-6 border-b border-base-content/10 bg-base-200/50 p-4 rounded-lg hover:bg-base-200 transition-colors max-w-3xl mx-auto w-full">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="avatar">
              <div className="w-6 h-6 rounded-full">
                <Image
                  src={Author.image || '/profile.svg'}
                  alt={Author.name || 'Author'}
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <span className="text-sm">{Author.name}</span>
            <span className="hidden sm:block text-base-content/60">·</span>
            <time className="hidden sm:block text-sm text-base-content/60">
              {format(new Date(createdAt), 'MMM d')}
            </time>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-1 line-clamp-2">{title}</h2>
            <p className="text-base-content/70 line-clamp-1 sm:line-clamp-2 mb-4">
              {description}
            </p>
          </div>

          <div className="flex items-center text-base-content/60 text-sm mb-4">
            <div className="flex items-center gap-1">
              <ThumbsUp height={15} />
              {_count.likedBy}
            </div>
            <span className="mx-2">·</span>
            <div className="flex items-center gap-1">
              <ThumbsDown height={15} />
              {_count.dislikedBy}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm">
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>

        <div className="relative">
          {' '}
          <div className="relative w-28 h-28 shrink-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 112px, 112px"
              className="object-cover rounded-md"
            />
          </div>
          <div className="absolute -top-2 -right-2 dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-square bg-base-100"
            >
              <MoreVertical className="h-4 w-4" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <ModalDeleteBtn modalId={modalId} />
              </li>
              <li>
                <ManageModalBtn manageModalId={manageModalId} />
              </li>
            </ul>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Delete Blog</h3>
          <p className="py-4">
            Are you sure you want to delete &ldquo;{title}&rdquo;? This action
            cannot be undone and the blog cannot be retrieved.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn">Cancel</button>
              <DeleteBtn blogId={id} />
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <ManageBlogDialog blogId={id} />
    </>
  );
};

export default BlogManageCard;
