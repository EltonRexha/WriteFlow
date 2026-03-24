"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopicBar from "./TopicBar";
import BlogsByTopic from "./BlogsByTopic";
import MainContentSkeleton from "./MainContentSkeleton";
import { useTopics } from "@/hooks/queries/topics";

interface TopicPageContentProps {
  topic: string;
}

export default function TopicPageContent({
  topic,
}: TopicPageContentProps) {
  const { data: topics = [] } = useTopics();
  const router = useRouter();
  
  const decodedTopic = decodeURIComponent(topic);
  const isLoading = topics.length === 0;

  useEffect(() => {
    if (
      topics.length > 0 &&
      !topics.find((item) => item.name.toLowerCase() === decodedTopic.toLowerCase())
    ) {
      router.push("/home/for-you");
    }
  }, [topics, decodedTopic, router]);

  if (isLoading) {
    return <MainContentSkeleton />;
  }

  return (
    <div className="flex-2 m-auto xl:m-0 lg:px-15 max-w-[800px]">
      <TopicBar topic={decodedTopic} initialTopics={topics} />
      <BlogsByTopic topic={decodedTopic} />
    </div>
  );
}
