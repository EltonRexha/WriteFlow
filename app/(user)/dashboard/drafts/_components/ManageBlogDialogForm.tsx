'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EditBlogPreviewSchema } from '@/schemas/editBlogSchema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { updatePreview } from '@/libs/api/blog';
import Select from 'react-select';
import { getCategories } from '@/libs/api/categories';
import { useToast } from '@/app/components/ToastProvider';
import type { GetBlogResponse } from '@/libs/api/blog';

type FormData = z.infer<typeof EditBlogPreviewSchema>;

type GetBlogSuccess = Extract<GetBlogResponse, { data: unknown }>;

const ManageBlogDialogForm = ({
  blogId,
  blog,
}: {
  blogId: string;
  blog: GetBlogSuccess;
}) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalId = `edit-modal-${blogId}`;
  const {
    data: categories = [],
    isError: categoriesIsError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(EditBlogPreviewSchema),
    defaultValues: {
      imageUrl: blog.data.imageUrl,
      description: blog.data.description,
      title: blog.data.title,
      id: blog.data.id,
      categories: blog.data.Categories.map((category) => category.name),
    },
  });

  const { addToast } = useToast();

  useEffect(() => {
    if (categoriesIsError) {
      addToast('Error fetching categories:', 'error');
    }
  }, [categoriesIsError, addToast]);

  const imgUrl = watch('imageUrl');
  const router = useRouter();

  const mutateBlog = useMutation({
    mutationFn: updatePreview,
    onSuccess: () => { },
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

              {Array.isArray(categories) && categories.length > 0 && (
                <div>
                  <Select<{ value: string; label: string }, true>
                    placeholder="Categories"
                    isMulti
                    menuPlacement="top"
                    options={categories.map(({ name }) => ({
                      value: name,
                      label: name,
                    }))}
                    menuPortalTarget={document.getElementById(modalId)}
                    menuPosition={'fixed'}
                    value={watch('categories').map((category) => ({
                      label: category,
                      value: category,
                    }))}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))',
                        borderColor:
                          'var(--fallback-border-color,oklch(var(--bc)/0.2))',
                      }),
                      menuList: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))',
                        padding: 0,
                      }),
                      menuPortal: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 9999,
                        position: 'absolute',
                      }),
                      option: (baseStyles, { isFocused }) => ({
                        ...baseStyles,
                        backgroundColor: isFocused
                          ? 'var(--fallback-b2,oklch(var(--b2)))'
                          : 'var(--fallback-b1,oklch(var(--b1)))',
                        color: 'var(--fallback-bc,oklch(var(--bc)))',
                        cursor: 'pointer',
                      }),
                      multiValue: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'var(--fallback-b2,oklch(var(--b2)))',
                      }),
                      multiValueLabel: (baseStyles) => ({
                        ...baseStyles,
                        color: 'var(--fallback-bc,oklch(var(--bc)))',
                      }),
                      multiValueRemove: (baseStyles) => ({
                        ...baseStyles,
                        color: 'var(--fallback-bc,oklch(var(--bc)))',
                        ':hover': {
                          backgroundColor:
                            'var(--fallback-error,oklch(var(--er)))',
                          color: 'white',
                        },
                      }),
                      input: (baseStyles) => ({
                        ...baseStyles,
                        color: 'var(--fallback-bc,oklch(var(--bc)))',
                      }),
                    }}
                    className="text-base-content"
                    onChange={(values) => {
                      setValue(
                        'categories',
                        values.map((value) => value.value)
                      );
                    }}
                  />
                  <p className="text-error">{errors['categories']?.message}</p>
                </div>
              )}
            </div>
          </div>

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
