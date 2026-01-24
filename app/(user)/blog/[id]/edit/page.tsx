import React from 'react';
import EditBlog from './_components/EditBlog';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className="lg:px-36">
      <EditBlog blogId={id} />
    </div>
  );
};

export default page;
