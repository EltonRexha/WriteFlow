import React from 'react';
import TopicBar from './_components/TopicBar';
import BlogsByTopic from './_components/BlogsByTopic';
import prisma from '@/prisma/client';
import { redirect } from 'next/navigation';
import SideBar from './_components/SideBar';

const Page = async ({ params }: { params: Promise<{ topic: string }> }) => {
  const { topic } = await params;
  const categories = await prisma.category.findMany({
    select: {
      name: true,
    },
  });
  const topics = [
    { name: 'For-You' },
    { name: 'Following' },
    ...categories,
  ];

  if (!topics.find((item) => item.name.toLowerCase() === topic.toLowerCase())) {
    redirect('/home');
  }
  return (
    <div className="xl:flex xl:justify-center space-x-5 px-5 sm:px-20 xl:px-10 py-2">
      <div className="flex-2 m-auto xl:m-0 lg:px-15 max-w-[800px]">
        <TopicBar topic={topic} initialTopics={topics} />
        <BlogsByTopic topic={topic} />
      </div>
      <div className="flex-1 hidden xl:block max-w-[300px]">
        <SideBar />
      </div>
    </div>
  );
};

export default Page;
