"use client";
import { BlogSchemaForm } from "@/schemas/blogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMounted } from "@/hooks/useMounted";
import { getCategories } from "@/libs/api/categories";
import { useToast } from "@/components/ToastProvider";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { publishDraft } from "@/libs/api/drafts";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import CategoriesSelect from "@/components/CategoriesSelect";
import {
  isApiZodErrorResponse,
} from "@/types/guards/isApiErrorResponse";
import isZodError from "@/types/guards/isZodApiErrorResponse";
import { isResponseError } from "@/types/guards/isResponseError";

type FormData = z.infer<typeof BlogSchemaForm>;

interface PublishDraftDialogProps {
  draftId: string;
  draftContent: string;
}

const PublishDraftDialog = ({ draftId, draftContent }: PublishDraftDialogProps) => {
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
    resolver: zodResolver(BlogSchemaForm),
  });

  const { addToast } = useToast();
  const imgUrl = watch("imageUrl");

  const { data: categories = [], isError: categoriesIsError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: false,
  });

  useEffect(() => {
    if (categoriesIsError) {
      addToast("Error fetching categories:", "error");
    }
  }, [categoriesIsError, addToast]);

  const router = useRouter();
  const mounted = useMounted();

  const mutation = useMutation({
    mutationFn: (payload: FormData) => {
      return publishDraft(draftId, payload);
    },
    onSuccess: (response) => {
      if (typeof response === "string") {
        addToast("Draft published successfully!", "success");
        router.push(`/blog/${response}`);
        return;
      }

      setError("Something wrong happened");
    },
    onError: (error) => {
      const unknownError = error as unknown;

      if (isApiZodErrorResponse(unknownError)) {
        setError(unknownError.response.data.issues[0].message);
        return;
      }

      if (isZodError(unknownError)) {
        setError(JSON.parse(unknownError.message)[0].message);
        return;
      }

      addToast("Something wrong happened", "error");
    },
  });

  if (!mounted) return null;

  async function onSubmit(data: FormData) {
    mutation.mutate(data);
  }

  function setValues(values: string[]) {
    setValue("categories", values);
  }

  return (
    <dialog id="publishDraftModal" className="modal">
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
        <h3 className="font-bold text-lg">Publish Draft</h3>

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
                      setValue("imageUrl", url);
                    }}
                    onClose={() => {
                      setShowImg(true);
                      (document.getElementById(
                        "publishDraftModal",
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
                <p className="text-error">{errors["imageUrl"]?.message}</p>
              )}
            </div>

            <div className="flex-1/3 space-y-2">
              <div>
                <input
                  className="input w-full"
                  placeholder="Title"
                  {...register("title")}
                  required
                />
                <p className="text-error">{errors["title"]?.message}</p>
              </div>

              <div>
                <textarea
                  className="textarea w-full h-30 resize-none "
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
                  modalId="publishDraftModal"
                />
              )}
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

export default PublishDraftDialog;
