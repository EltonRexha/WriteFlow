export default function SideBarSkeleton() {
  return (
    <div className="w-96 p-10 border-l min-h-[90vh] border-base-content/10 space-y-10">
      {/* Popular Blogs Section */}
      <div>
        <h1 className="skeleton h-8 w-24 text-2xl text-base-content p-2"></h1>
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <article className="flex gap-6 py-6 cursor-pointer border-base-content/10 group">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="skeleton w-6 h-6 rounded-full"></div>
                  </div>
                  <div className="skeleton h-4 w-20 text-sm text-base-content/70"></div>
                  <div className="skeleton h-4 w-2 text-sm text-base-content/60"></div>
                  <div className="skeleton h-4 w-12 text-sm text-base-content/60"></div>
                </div>
                <div className="block group-hover:text-primary transition-colors">
                  <div className="skeleton h-5 w-full"></div>
                  <div className="skeleton h-5 w-3/4 mt-1"></div>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* Popular Writers Section */}
      <div>
        <h1 className="skeleton h-8 w-20 text-2xl text-base-content p-2"></h1>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-4 cursor-pointer px-2 rounded-lg transition-colors group"
          >
            <div className="avatar">
              <div className="skeleton w-10 h-10 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="skeleton h-5 w-32 font-semibold text-base-content"></div>
              <div className="skeleton h-4 w-40 text-sm text-base-content/70 mt-1"></div>
              <div className="skeleton h-3 w-full text-xs text-base-content/60 line-clamp-1 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
