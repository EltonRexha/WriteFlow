import TopicPageContent from "./_components/TopicPageContent";
import SideBar from "./_components/SideBar";

const Page = async ({ params }: { params: Promise<{ topic: string }> }) => {
  const { topic } = await params;

  return (
    <div className="xl:flex xl:justify-center space-x-5 px-5 sm:px-20 xl:px-10 py-2">
      <TopicPageContent topic={topic} />
      
      <div className="flex-1 hidden xl:block max-w-[300px]">
        <SideBar />
      </div>
    </div>
  );
};

export default Page;
