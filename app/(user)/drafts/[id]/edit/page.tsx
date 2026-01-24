import React from 'react';
import EditDraft from './_components/EditDraft';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className="lg:px-36">
      <EditDraft draftId={id} />
    </div>
  );
};

export default page;
