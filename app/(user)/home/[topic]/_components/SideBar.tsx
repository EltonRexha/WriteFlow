"use client";
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SideBarSkeleton from './SideBarSkeleton';
import { useSidebarContent } from '@/hooks/queries/sidebar';

const SideBar = () => {
  const { data, isLoading } = useSidebarContent();
  const popularBlogs = data?.popularBlogs || [];
  const popularWriters = data?.popularWriters || [];

  if (isLoading) {
    return <SideBarSkeleton />;
  }

  return (
    <div className="w-96 p-10 border-l min-h-[90vh] fixed border-base-content/10 space-y-10">
      <div>
        {!!popularBlogs.length && (
          <>
            <h1
              className="text-2xl text-base-content p-2"
            >
              Popular
            </h1>
            {popularBlogs.map(({ id, Author, createdAt, title }) => (
              <div key={id}>
                <article className="flex gap-6 py-6 cursor-pointer border-base-content/10 group">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-6 h-6 rounded-full">
                          <Image
                            src={Author.image || '/profile.svg'}
                            alt={Author.name || 'Author'}
                            width={24}
                            height={24}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-base-content/70">
                        {Author.name}
                      </span>
                      <span className="text-sm text-base-content/60">·</span>
                      <time className="text-sm text-base-content/60">
                        {format(new Date(createdAt), 'MMM d')}
                      </time>
                    </div>
                    <Link
                      href={`/blog/${id}`}
                      className="block group-hover:text-primary transition-colors"
                    >
                      <h2 className="text-base font-bold line-clamp-2">
                        {title}
                      </h2>
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </>
        )}
      </div>

      <div>
        {!!popularBlogs.length && (
          <>
            <h1
              className="text-2xl text-base-content p-2"
            >
              Writers
            </h1>
            {popularWriters.map((writer) => (
              <div
                key={writer.id}
                className="flex items-center gap-4 py-4 cursor-pointer px-2 rounded-lg transition-colors group"
              >
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <Image
                      src={writer.image || '/profile.svg'}
                      alt={writer.name || 'Writer'}
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                <Link href={`/user/${writer.id}`}>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base-content group-hover:text-primary">
                      {writer.name}
                    </h3>
                    <p className="text-sm text-base-content/70">
                      {writer._count.Blogs} blogs · {writer._count.FollowedBy}{' '}
                      followers
                    </p>
                    <div className="text-xs text-base-content/60 line-clamp-1">
                      Most popular: {writer.Blogs[0]?.title}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
