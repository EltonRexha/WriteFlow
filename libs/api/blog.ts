import axios from '@/config/axios';
import { EditBlogPreviewSchema } from '@/schemas/editBlogSchema';
import { z, ZodError } from 'zod';

type UpdatePreview = z.infer<typeof EditBlogPreviewSchema>;

export async function updatePreview(data: UpdatePreview) {
  console.log({data});
  const res = await axios.put<
    | ZodError<{
        title: string;
        categories: string[];
        imageUrl: string;
        description: string;
        id: string;
      }>
    | {
        error: string;
      }
  >(`/blog/preview/${data.id}`, data);
  return res.data;
}
