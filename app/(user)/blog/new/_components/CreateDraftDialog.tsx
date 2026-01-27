"use client";
import { DraftSchema } from "@/schemas/draftSchema";
import { useCreateDraft } from "@/hooks/queries/drafts";
import { isActionError } from "@/types/ActionError";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof DraftSchema>;

const CreateDraftDialog = ({ blogContent }: { blogContent: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(DraftSchema),
  });

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const mutation = useCreateDraft();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) {
        setError(mutation.data.error.message);
        return;
      }
      router.push("/dashboard/drafts");
    }
  }, [mutation.isSuccess, mutation.data, router]);

  useEffect(() => {
    if (mutation.isError) {
      setError("Something wrong happened");
    }
  }, [mutation.isError]);

  async function onSubmit(data: FormData) {
    mutation.mutate(data);
  }

  useEffect(() => {
    setValue("content", blogContent);
  }, [blogContent, setValue]);

  return (
    <dialog id="saveDraftModal" className="modal">
      <div className="modal-box flex flex-col space-y-4">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Save draft</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
          noValidate
        >
          <input
            className="input w-full"
            placeholder="Draft Name"
            {...register("name")}
            required
          />
          <button
            className="btn btn-primary btn-soft block w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </form>
        <div
          id="errors"
          className="flex flex-col space-y-2 text-sm text-red-500"
        >
          {Object.keys(errors).map((item) => {
            const errorMessage = errors[item as keyof typeof errors]?.message;

            return <p key={item}>{errorMessage}</p>;
          })}
          {error && <p>{error}</p>}
        </div>
      </div>
    </dialog>
  );
};

export default CreateDraftDialog;
