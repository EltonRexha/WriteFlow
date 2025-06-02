'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getBlog } from '@/server-actions/blogs/action';
import { EditBlogPreviewSchema } from '@/schemas/editBlogSchema';
import { useMutation } from '@tanstack/react-query';
import { updatePreview } from '@/libs/api/blog';

type FormData = z.infer<typeof EditBlogPreviewSchema>;

const ManageBlogDialogForm = ({
  blogId,
  blog,
}: {
  blogId: string;
  blog: Awaited<ReturnType<typeof getBlog>>;
}) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalId = `edit-modal-${blogId}`;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(EditBlogPreviewSchema),
    defaultValues: {
      imageUrl: blog.data?.imageUrl,
      description: blog.data?.description,
      title: blog.data?.title,
      id: blog.data?.id,
      categories: blog.data?.Categories.map((category) => category.name),
    },
  });

  const imgUrl = watch('imageUrl');
  const router = useRouter();

  const mutateBlog = useMutation({
    mutationFn: updatePreview,
    onSuccess: () => {},
  });

  async function onFormSubmit(data: FormData) {
    await mutateBlog.mutateAsync(data);
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    router.refresh();
  }

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box flex flex-col space-y-4 min-w-[35%] ">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Manage blog</h3>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          noValidate
          className="space-y-2"
        >
          <div className="space-x-2 space-y-4 lg:flex lg:space-y-0">
            <div className="flex-1">
              <div className="border-dashed border-neutral-content border-2 flex items-center justify-center aspect-square relative">
                {' '}
                <CldImage
                  src={imgUrl}
                  alt="thumbnail"
                  className="absolute -z-10 object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  fill
                ></CldImage>
                <CldUploadWidget
                  uploadPreset="blog_thumbnails"
                  onSuccess={(result) => {
                    const info = result?.info as CloudinaryUploadWidgetInfo;
                    const url = info.secure_url;
                    setValue('imageUrl', url);
                  }}
                  onClose={() => {
                    (document.getElementById(
                      modalId
                    ) as HTMLDialogElement)!.showModal();
                  }}
                >
                  {({ open }) => (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        open();
                        const btn = closeBtnRef.current;
                        if (btn) {
                          btn.click();
                        }
                      }}
                    >
                      Change Thumbnail
                    </button>
                  )}
                </CldUploadWidget>
              </div>
              {!imgUrl && (
                <p className="text-error">{errors['imageUrl']?.message}</p>
              )}
            </div>

            <div className="flex-1/3 space-y-2">
              <div>
                <input
                  className="input w-full"
                  placeholder="Title"
                  {...register('title')}
                  required
                />
                <p className="text-error">{errors['title']?.message}</p>
              </div>

              <div>
                <textarea
                  className="textarea w-full h-30 resize-none "
                  placeholder="Description"
                  {...register('description')}
                  required
                />
                <p className="text-error">{errors['description']?.message}</p>
              </div>
            </div>
          </div>
          {Object.keys(errors)}
          <button
            className="btn btn-primary btn-soft block w-full"
            type="submit"
          >
            Change
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default ManageBlogDialogForm;
