'use client';
import { createComment } from '@/libs/api/comments';
import { isActionError } from '@/types/ActionError';
import { useToast } from '../../../../../components/ToastProvider';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BlogCommentSchema } from '@/schemas/blogCommentSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: FormData) => createComment(payload),
    onSuccess: (response) => {
      if (isActionError(response)) {
        addToast(response.error.message, 'error');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'user', blogId] });
      router.refresh();
    },
    onError: () => {
      addToast('Something went wrong creating comment', 'error');
    },
  });

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
