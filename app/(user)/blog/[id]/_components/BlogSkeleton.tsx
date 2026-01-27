export default function BlogSkeleton() {
  return (
    <div className="pt-4">
      <div id="mainContent" className="max-w-[82ch] px-2 m-auto text-pretty">
        <div id="thumbnail" className="relative">
          {/* Title Skeleton - matches h1 with font-bold text-4xl leading-tight */}
          <div className="skeleton h-10 w-3/4"></div>

          {/* Description Skeleton - matches p with text-xl pt-2 font-medium line-clamp-3 leading-relaxed */}
          <div className="pt-2 space-y-1">
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-5/6"></div>
            <div className="skeleton h-6 w-4/6"></div>
          </div>

          {/* Author Info Skeleton - matches flex items-center space-x-2 mt-4 */}
          <div className="flex items-center space-x-2 mt-4 mb-4">
            <div className="w-8 aspect-square relative cursor-pointer">
              <div className="skeleton w-full h-full rounded-full"></div>
            </div>
            <div className="skeleton h-5 w-24"></div>
            <div className="skeleton h-6 w-16"></div>
            <div className="skeleton h-4 w-4"></div>
            <div className="skeleton h-4 w-20"></div>
          </div>

          {/* Main Image Skeleton - matches Image with pt-4 */}
          <div className="skeleton w-full aspect-square pt-4"></div>
        </div>

        {/* Content Skeleton - matches mainSection with my-4 */}
        <div id="mainSection" className="">
          <div className="my-4 space-y-3">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-5/6"></div>
            <div className="skeleton h-4 w-4/6"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </div>

          {/* Like/Dislike Section Skeleton - matches likeSection with pt-2 mb-10 */}
          <div id="likeSection" className="pt-2 mb-10">
            <div className="flex space-x-2 items-center">
              <div className="flex items-center">
                <div className="skeleton h-8 w-8"></div>
                <div className="skeleton h-4 w-8 ml-2"></div>
              </div>
              <div className="flex items-center">
                <div className="skeleton h-8 w-8"></div>
                <div className="skeleton h-4 w-8 ml-2"></div>
              </div>
              <div className="flex items-center space-x-2 ml-auto">
                <div className="skeleton h-4 w-4"></div>
                <div className="skeleton h-4 w-8"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Skeleton - matches BlogComments structure */}
        <div className="space-y-4">
          <div className="skeleton h-6 w-32"></div>
          <div className="space-y-3">
            <div className="skeleton h-16 w-full"></div>
            <div className="skeleton h-16 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
