'use client';
import { DraftSchema } from '@/schemas/draftSchema';
import { createDraft } from '@/server-actions/drafts/actions';
import { isActionError } from '@/types/ActionError';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from './ToastProvider';
import { useRouter } from 'next/navigation';

type FormData = z.infer<typeof DraftSchema>;

const SaveDraftDialog = ({ blogContent }: { blogContent: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(DraftSchema),
  });

  const { addToast } = useToast();
  const router = useRouter();

  async function onSubmit(data: FormData) {
    const response = await createDraft(data);

    if (isActionError(response)) {
      addToast(response.error.message, 'error');
    } else {
      router.push('/home');
    }
  }

  useEffect(() => {
    setValue('content', blogContent);
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
        >
          <input
            className="input w-full"
            placeholder="Draft Name"
            {...register('name')}
            required
          />
          <button className="btn btn-primary btn-soft block w-full">
            Save
          </button>
        </form>
        <div
          id="errors"
          className="flex flex-col space-y-2 text-sm text-accent"
        >
          {Object.keys(errors).map((item) => {
            const errorMessage = errors[item as keyof typeof errors]?.message;

            return <p key={item}>{errorMessage}</p>;
          })}
        </div>
      </div>
    </dialog>
  );
};

export default SaveDraftDialog;
