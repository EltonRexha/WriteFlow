import { Suspense } from 'react';
import BlogContentWrapper from './_components/BlogContentWrapper';
import BlogSkeleton from './_components/BlogSkeleton';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogContentWrapper blogId={id} />
    </Suspense>
  );
};

export default page;
