'use client';
import { BlogSchema } from '@/schemas/blogSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Select from 'react-select';
import { useMounted } from '@/hooks/useMounted';
import { getCategories } from '@/libs/api/categories';
import { useToast } from '../../../../components/ToastProvider';
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';
import { createBlog } from '@/libs/api/blog';
import { isActionError } from '@/types/ActionError';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';

type FormData = z.infer<typeof BlogSchema>;

const CreateBlogDialog = ({ blogContent }: { blogContent: string }) => {
  const [showImage, setShowImg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(BlogSchema),
  });

  useEffect(() => {
    setValue('content', blogContent);
  }, [blogContent, setValue]);

  const { addToast } = useToast();
  const imgUrl = watch('imageUrl');

  const { data: categories = [], isError: categoriesIsError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    retry: false,
  });

  useEffect(() => {
    if (categoriesIsError) {
      addToast('Error fetching categories:', 'error');
    }
  }, [categoriesIsError, addToast]);

  const router = useRouter();

  const mounted = useMounted();

  const mutation = useMutation({
    mutationFn: (payload: FormData) => createBlog(payload),
    onSuccess: (response) => {
      if (typeof response === 'string') {
        router.push(`/blog/${response}`);
        return;
      }

      if (isActionError(response)) {
        setError(response.error.message);
        return;
      }

      setError('Something wrong happened');
    },
    onError: () => {
      addToast('Something wrong happened', 'error');
    },
  });

  if (!mounted) return null;

  async function onSubmit(data: FormData) {
    mutation.mutate(data);
  }

  return (
    <dialog id="createBlogModal" className="modal">
      <div className="modal-box flex flex-col space-y-4 min-w-[35%] ">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="closeBtn"
            ref={closeBtnRef}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Publish blog</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-2"
        >
          <div className="space-x-2 space-y-4 lg:flex lg:space-y-0">
            <div className="flex-1">
              <div className="border-dashed border-neutral-content border-2 flex items-center justify-center aspect-square relative">
                {imgUrl && showImage ? (
                  <CldImage
                    src={imgUrl}
                    alt="thumbnail"
                    className="absolute z-50 object-cover"
                    fill
                  ></CldImage>
                ) : (
                  <CldUploadWidget
                    uploadPreset="blog_thumbnails"
                    onSuccess={(result) => {
                      const info = result?.info as CloudinaryUploadWidgetInfo;
                      const url = info.secure_url;
                      setValue('imageUrl', url);
                    }}
                    onClose={() => {
                      setShowImg(true);
                      (document.getElementById(
                        'createBlogModal'
                      ) as HTMLDialogElement)!.showModal();
                    }}
                  >
                    {({ open }) => (
                      <button
                        className="btn btn-dash border-neutral-content"
                        onClick={() => {
                          open();
                          const btn = closeBtnRef.current;
                          if (btn) {
                            btn.click();
                          }
                        }}
                      >
                        Add Thumbnail
                      </button>
                    )}
                  </CldUploadWidget>
                )}
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

              {Array.isArray(categories) && (
                <div>
                  <Select<{ value: string; label: string }, true>
                    placeholder="Categories"
                    isMulti
                    menuPlacement="top"
                    options={categories.map(({ name }) => ({
                      value: name,
                      label: name,
                    }))}
                    menuPortalTarget={document.getElementById(
                      'createBlogModal'
                    )}
                    menuPosition={'fixed'}
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
          <button className="btn btn-primary btn-soft block w-full">
            Publish
          </button>
          {error && <p className="text-error my-2">{error}</p>}
        </form>
      </div>
    </dialog>
  );
};

export default CreateBlogDialog;
