'use client';
import { BlogSchema } from '@/schemas/blogSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Select from 'react-select';
import { useMounted } from '@/hooks/useMounted';
import { getCategories } from '@/server-actions/categories/action';
import { useToast } from './ToastProvider';
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';

type FormData = z.infer<typeof BlogSchema>;

const CreateBlogDialog = ({ blogContent }: { blogContent: string }) => {
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [showImage, setShowImg] = useState(false);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        addToast('Error fetching categories:', 'error');
      }
    };

    fetchCategories();
  }, [addToast]);

  const mounted = useMounted();
  if (!mounted) return null;

  function onSubmit(data: FormData) {
    console.log(data);
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
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="border-dashed border-neutral border-2 flex items-center justify-center aspect-square relative">
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
                        className="btn btn-dash btn-neutral"
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
                <p className="text-accent">{errors['imageUrl']?.message}</p>
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
                <p className="text-accent">{errors['title']?.message}</p>
              </div>

              <div>
                <textarea
                  className="textarea w-full h-30 resize-none "
                  placeholder="Description"
                  {...register('description')}
                  required
                />
                <p className="text-accent">{errors['description']?.message}</p>
              </div>

              {categories && (
                <div>
                  <Select
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
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                        position: 'absolute',
                      }),
                    }}
                    className="text-base-content absolute z-50"
                    onChange={(values) => {
                      setValue(
                        'categories',
                        values.map((value) => value.value)
                      );
                    }}
                  />
                  <p className="text-accent">{errors['categories']?.message}</p>
                </div>
              )}
            </div>
          </div>
          <button className="btn btn-primary btn-soft block w-full">
            Publish
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default CreateBlogDialog;
