import { Suspense } from "react";
import TopicPageContent from "./_components/TopicPageContent";
import SideBar from "./_components/SideBar";
import MainContentSkeleton from "./_components/MainContentSkeleton";
import SideBarSkeleton from "./_components/SideBarSkeleton";

const Page = async ({ params }: { params: Promise<{ topic: string }> }) => {
  const { topic } = await params;

  return (
    <div className="xl:flex xl:justify-center space-x-5 px-5 sm:px-20 xl:px-10 py-2">
      <Suspense fallback={<MainContentSkeleton />}>
        <TopicPageContent topic={topic} />
      </Suspense>
      
      <div className="flex-1 hidden xl:block max-w-[300px]">
        <Suspense fallback={<SideBarSkeleton />}>
          <SideBar />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
