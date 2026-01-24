'use client';
import { useCreateComment } from '@/hooks/queries/comments';
import { isActionError } from '@/types/ActionError';
import { useToast } from '../../../../../components/ToastProvider';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BlogCommentSchema } from '@/schemas/blogCommentSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

type FormData = z.infer<typeof BlogCommentSchema>;

const CreateBlogComment = ({ blogId }: { blogId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(BlogCommentSchema),
  });
  const { addToast } = useToast();
  const router = useRouter();

  const mutation = useCreateComment();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) {
        addToast(mutation.data.error.message, 'error');
        return;
      }
      router.refresh();
    }
  }, [mutation.isSuccess, mutation.data, addToast, router]);

  useEffect(() => {
    if (mutation.isError) {
      addToast('Something went wrong creating comment', 'error');
    }
  }, [mutation.isError, addToast]);

  useEffect(() => {
    setValue('blogId', blogId);
  }, [setValue, blogId]);
  async function onSubmit(data: FormData) {
    mutation.mutate(data);
  }

  return (
    <>
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className="textarea textarea-bordered resize-none p-2 rounded-sm w-full min-h-32"
          placeholder="What are your thoughts?"
          {...register('content')}
        />
        <button className="btn btn-primary btn-sm absolute bottom-2 right-2">
          Comment
        </button>
      </form>
      <p className="text-error mt-2 text-sm">{errors['content']?.message}</p>
    </>
  );
};

export default CreateBlogComment;
