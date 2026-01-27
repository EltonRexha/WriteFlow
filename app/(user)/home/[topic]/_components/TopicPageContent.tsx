import prisma from '@/prisma/client';
import { redirect } from 'next/navigation';
import TopicBar from './TopicBar';
import BlogsByTopic from './BlogsByTopic';

interface TopicPageContentProps {
  topic: string;
}

export default async function TopicPageContent({ topic }: TopicPageContentProps) {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
    },
  });
  const topics = [{ name: "For-You" }, { name: "Following" }, ...categories];

  if (!topics.find((item) => item.name.toLowerCase() === topic.toLowerCase())) {
    redirect("/home/for-you");
  }

  return (
    <div className="flex-2 m-auto xl:m-0 lg:px-15 max-w-[800px]">
      <TopicBar topic={topic} initialTopics={topics} />
      <BlogsByTopic topic={topic} />
    </div>
  );
}
