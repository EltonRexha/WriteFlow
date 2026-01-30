"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EditBlogPreviewSchema } from "@/schemas/editBlogSchema";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateBlogPreview } from "@/hooks/queries/blog";
import { useCategories } from "@/hooks/queries/categories";
import CategoriesSelect from "@/components/CategoriesSelect";
import { useToast } from "@/components/ToastProvider";
import type { GetBlogResponse } from "@/libs/api/services/blog";

type FormData = z.infer<typeof EditBlogPreviewSchema>;

type GetBlogSuccess = Extract<GetBlogResponse, { data: unknown }>;

const ManageBlogDialogForm = ({
  blogId,
  blog,
}: {
  blogId: string;
  blog: GetBlogSuccess;
}) => {
  const queryClient = useQueryClient();

  const modalId = `edit-modal-${blogId}`;
  const modal = useRef<HTMLDialogElement>(null);
  const { data: categories = [], isError: categoriesIsError } = useCategories();

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
      addToast("Error fetching categories:", "error");
    }
  }, [categoriesIsError, addToast]);

  const imgUrl = watch("imageUrl");

  const mutateBlog = useUpdateBlogPreview();

  async function onFormSubmit(data: FormData) {
    await mutateBlog.mutateAsync(data);
    modal.current?.close();
    queryClient.invalidateQueries({ queryKey: ["dashboardUserBlogs"] });
  }

  return (
    <dialog id={modalId} className="modal" ref={modal}>
      <div className="modal-box flex flex-col space-y-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Manage blog</h3>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <div className="border-dashed border-neutral-content border-2 flex items-center justify-center aspect-square relative">
                  {" "}
                  <CldImage
                    src={imgUrl}
                    alt="thumbnail"
                    className="absolute -z-10 object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    fill
                  ></CldImage>
                  <CldUploadWidget
                    uploadPreset="blog_thumbnails"
                    options={{ multiple: false, maxFiles: 1 }}
                    onSuccess={(result) => {
                      const info = result?.info as CloudinaryUploadWidgetInfo;
                      const url = info.secure_url;
                      setValue("imageUrl", url);
                    }}
                    onClose={() => {
                      modal.current?.showModal();
                    }}
                  >
                    {({ open }) => (
                      <button
                        className="btn btn-primary btn-wide"
                        type="button"
                        onClick={() => {
                          //Close the modal so we can show the cloudinary widget
                          modal.current?.close();
                          open();
                        }}
                      >
                        Change Thumbnail
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
                {!imgUrl && (
                  <p className="text-error">{errors["imageUrl"]?.message}</p>
                )}
              </div>

              <div className="w-full md:w-2/3 space-y-3">
                <div>
                  <input
                    className="input input-md w-full"
                    placeholder="Title"
                    {...register("title")}
                    required
                  />
                  <p className="text-error">{errors["title"]?.message}</p>
                </div>

                <div>
                  <textarea
                    className="textarea textarea-md w-full h-40 resize-none"
                    placeholder="Description"
                    {...register("description")}
                    required
                  />
                  <p className="text-error">{errors["description"]?.message}</p>
                </div>

                {Array.isArray(categories) && (
                  <div>
                    <CategoriesSelect
                      categories={categories}
                      value={watch("categories")}
                      setValues={(values) => setValue("categories", values)}
                      errors={errors}
                    />
                    <p className="text-error">
                      {errors["categories"]?.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-soft block w-full"
            type="submit"
            disabled={mutateBlog.isPending}
          >
            {mutateBlog.isPending ? "Updating..." : "Change"}
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default ManageBlogDialogForm;
