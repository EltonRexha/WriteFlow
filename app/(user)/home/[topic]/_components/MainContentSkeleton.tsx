export default function MainContentSkeleton() {
  return (
    <div className="flex-2 m-auto xl:m-0 lg:px-15 max-w-[800px]">
      <div className="skeleton h-10 w-full"></div>
      {/* Blog Cards */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <article
            key={i}
            className="flex gap-6 py-6 border-b border-base-content/10"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="skeleton w-6 h-6 rounded-full"></div>
                <div className="skeleton h-4 w-24 hidden sm:block"></div>
                <div className="skeleton h-4 w-16 hidden sm:block"></div>
              </div>

              <div className="space-y-2">
                <div className="skeleton h-7 w-3/4"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-2/3"></div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="skeleton h-5 w-12"></div>
                <div className="skeleton h-5 w-12"></div>
              </div>
            </div>

            <div className="skeleton w-28 h-28 flex-shrink-0"></div>
          </article>
        ))}
      </div>
    </div>
  );
}
