import React from 'react';
import TopicBar from './_components/TopicBar';
import BlogsByTopic from './_components/BlogsByTopic';
import { getCategories } from '@/server-actions/categories/action';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { topic: string } }) => {
  const { topic } = params;
  const topics = [
    { name: 'For-You' },
    { name: 'Following' },
    ...(await getCategories()),
  ];

  if (!topics.find((item) => item.name.toLowerCase() === topic.toLowerCase())) {
    redirect('/home');
  }
  return (
    <div className="md:flex px-10 lg:px-60">
      <div className="flex-1">
        <div>
          <TopicBar topic={topic} initialTopics={topics} />
          <BlogsByTopic topic={topic} />
        </div>
      </div>
      <div className="w-82"></div>
    </div>
  );
};

export default Page;
