import React from 'react';
import TopicBar from './_components/TopicBar';
import BlogsByTopic from './_components/BlogsByTopic';

const Page = async ({ params }: { params: { topic: string } }) => {
  const { topic } = await params;
  return (
    <div className="md:flex px-10 lg:px-60">
      <div className="flex-1 ">
        <div className="">
          <TopicBar topic={topic} />
          <BlogsByTopic topic={topic} />
        </div>
      </div>
      <div className="w-82 "></div>
    </div>
  );
};

export default Page;
