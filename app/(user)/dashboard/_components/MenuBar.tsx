'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const MenuBar = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const pathname = usePathname();

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScroll();
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full border-base-content/10">
      <div className="relative max-w-screen-xl">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
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
          className="overflow-x-auto no-scrollbar"
        >
          <div
            role="tablist"
            className="tabs tabs-border whitespace-nowrap inline-block min-w-full"
          >
            <Link
              href="/dashboard/stats"
              className={clsx(
                'tab capitalize',
                pathname.endsWith('/stats') ? 'tab-active' : ''
              )}
            >
              Your Stats
            </Link>
            <Link
              href="/dashboard/blogs"
              className={clsx(
                'tab capitalize',
                pathname.endsWith('/blogs') ? 'tab-active' : ''
              )}
            >
              Manage Blogs
            </Link>
            <Link
              href="/dashboard/drafts"
              className={clsx(
                'tab capitalize',
                pathname.endsWith('/drafts') ? 'tab-active' : ''
              )}
            >
              Manage Drafts
            </Link>
          </div>
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
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

export default MenuBar;
