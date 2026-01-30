"use client";
import { BlogSchemaForm } from "@/schemas/blogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMounted } from "@/hooks/useMounted";
import { useCategories } from "@/hooks/queries/categories";
import { useCreateBlog } from "@/hooks/queries/blog";
import { useToast } from "../../../../../components/ToastProvider";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { useRouter } from "next/navigation";
import CategoriesSelect from "@/components/CategoriesSelect";
import {
  isApiZodErrorResponse,
  isApiErrorResponse,
} from "@/types/guards/isApiErrorResponse";
import isZodError from "@/types/guards/isZodApiErrorResponse";
import { isResponseError } from "@/types/guards/isResponseError";
import { INITIAL_CONTENT } from "@/components/textEditor/TextEditor";
import { generateJSON } from "@tiptap/core";
import { TIP_TAP_EXTENSIONS } from "@/libs/TipTapExtensions";

type FormData = z.infer<typeof BlogSchemaForm>;

const CreateBlogDialog = ({ blogContent }: { blogContent: string }) => {
  const [showImage, setShowImg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(BlogSchemaForm),
  });

  const { addToast } = useToast();
  const imgUrl = watch("imageUrl");
  const modal = useRef<HTMLDialogElement | null>(null);

  const { data: categories = [], isError: categoriesIsError } = useCategories();

  useEffect(() => {
    if (categoriesIsError) {
      addToast("Error fetching categories:", "error");
    }
  }, [categoriesIsError, addToast]);

  const router = useRouter();
  const mounted = useMounted();

  if (blogContent === INITIAL_CONTENT) {
    blogContent = JSON.stringify(generateJSON(blogContent, TIP_TAP_EXTENSIONS));
  }

  const mutation = useCreateBlog();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (typeof mutation.data === "string") {
        router.push(`/blog/${mutation.data}`);
        return;
      }
      setError("Something wrong happened");
    }
  }, [mutation.isSuccess, mutation.data, router]);

  useEffect(() => {
    if (mutation.isError && mutation.error) {
      const unknownError = mutation.error as unknown;

      // Check for Zod validation errors
      if (isApiZodErrorResponse(unknownError)) {
        setError(unknownError.response.data.issues[0].message);
        return;
      }

      if (isZodError(unknownError)) {
        setError(JSON.parse(unknownError.message)[0].message);
        return;
      }

      // Check for backend ResponseError format (e.g., "blog content must be at least 50 characters long")
      if (isApiErrorResponse(unknownError)) {
        const errorData = unknownError.response.data;
        if (isResponseError(errorData)) {
          setError(errorData.error.message);
          return;
        }
        // Fallback: try to get message from error object directly
        if (
          errorData &&
          typeof errorData === "object" &&
          "error" in errorData
        ) {
          const err = errorData.error as { message?: string };
          if (err && typeof err.message === "string") {
            setError(err.message);
            return;
          }
        }
      }

      addToast("Something wrong happened", "error");
    }
  }, [mutation.isError, mutation.error, addToast]);

  if (!mounted) return null;

  async function onSubmit(data: FormData) {
    // Include the blog content in the submission
    mutation.mutate({
      ...data,
      content: blogContent,
    });
  }

  function setValues(values: string[]) {
    setValue("categories", values);
  }

  return (
    <dialog id="createBlogModal" className="modal" ref={modal}>
      <div className="modal-box flex flex-col space-y-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="closeBtn"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Publish blog</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
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
                        setValue("imageUrl", url);
                      }}
                      onClose={() => {
                        setShowImg(true);
                        modal.current?.showModal();
                      }}
                    >
                      {({ open }) => (
                        <button
                          className="btn btn-dash border-neutral-content"
                          onClick={() => {
                            //Close the modal so we can show the cloudinary widget
                            modal.current?.close();
                            open();
                          }}
                        >
                          Add Thumbnail
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
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
                  <CategoriesSelect
                    categories={categories}
                    setValues={setValues}
                    errors={errors}
                  />
                )}
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-soft block w-full"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Publishing..." : "Publish"}
          </button>
          {error && <p className="text-error my-2">{error}</p>}
        </form>
      </div>
    </dialog>
  );
};

export default CreateBlogDialog;
