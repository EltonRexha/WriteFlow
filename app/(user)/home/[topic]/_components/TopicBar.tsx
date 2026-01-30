"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface TopicBarProps {
  topic: string;
  initialTopics: { name: string }[];
}

const TopicBar = ({ topic, initialTopics }: TopicBarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const router = useRouter();

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scrollToSelectedTopic = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const selectedTab = scrollContainerRef.current.querySelector('input[type="radio"].tab-active') as HTMLInputElement;
    if (!selectedTab) return;
    
    const container = scrollContainerRef.current;
    const containerWidth = container.clientWidth;
    const tabLeft = selectedTab.offsetLeft;
    const tabWidth = selectedTab.offsetWidth;
    
    // Center the selected tab in the container
    const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScroll();
      scrollContainer.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      
      // Scroll to selected topic after a short delay to ensure tabs are rendered
      const timeoutId = setTimeout(() => {
        scrollToSelectedTopic();
        checkScroll();
      }, 100);

      return () => {
        scrollContainer.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [checkScroll, scrollToSelectedTopic, topic]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -200 : 200;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full border-b border-base-content/10">
      <div className="relative max-w-screen-xl mx-auto">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="btn btn-circle btn-sm btn-ghost absolute left-0 top-1 z-10 bg-base-100/80 backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto no-scrollbar px-8"
        >
          <div
            role="tablist"
            className="tabs tabs-border whitespace-nowrap inline-block min-w-full"
          >
            {initialTopics.map((item) => (
              <input
                type="radio"
                name="my_tabs_1"
                className={clsx(
                  "tab",
                  item.name.toLocaleLowerCase() === topic.toLocaleLowerCase()
                    ? "tab-active"
                    : "",
                )}
                aria-label={`${item.name}`}
                key={item.name}
                onClick={() => {
                  router.push(`/home/${item.name}`);
                }}
              />
            ))}
          </div>
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="btn btn-circle btn-sm btn-ghost absolute right-0 top-1 z-10 bg-base-100/80 backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TopicBar;
