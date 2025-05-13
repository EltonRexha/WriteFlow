'use client';
import { createComment } from '@/server-actions/comments/action';
import { isActionError } from '@/types/ActionError';
import { useToast } from './ToastProvider';
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

  useEffect(() => {
    setValue('blogId', blogId);
  }, [setValue, blogId]);

  async function onSubmit(data: FormData) {
    const response = await createComment(data);

    if (isActionError(response)) {
      addToast(response.error.message, 'error');
    }

    router.refresh();
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
