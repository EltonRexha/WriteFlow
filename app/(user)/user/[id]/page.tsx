import prisma from '@/prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import defaultProfile from '@/public/profile.svg';
import { Calendar, Mail, User as UserIcon } from 'lucide-react';
import { Limelight } from 'next/font/google';
import clsx from 'clsx';
import { format } from 'date-fns';
import UserBlogsList from './_components/UserBlogsList';

const limeLight = Limelight({
  weight: '400',
  subsets: ['latin'],
});

interface Props {
  params: {
    id: string;
  };
}

const page = async ({ params: { id } }: Props) => {
  const user = await getUser(id);

  if (!user) return <div>User not found</div>;

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Profile Header */}
      <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full">
                <Image
                  src={user.image || defaultProfile}
                  alt={user.name || 'User'}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
            </div>
            <h1 className={clsx('text-3xl font-bold', limeLight.className)}>
              {user.name}
            </h1>
            <div className="text-base-content/70 text-lg">
              {user._count.FollowedBy} followers · {user._count.Follows}{' '}
              following
            </div>
            <button className="btn btn-primary rounded-full btn-sm">
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Blog Posts Column */}
        <div className="flex-1 max-w-3xl mx-auto lg:mx-0">
          {' '}
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          <UserBlogsList userEmail={user.email as string} />
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="w-80 space-y-8 sticky top-8">
            {/* Profile Info Section */}
            <div className="bg-base-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Profile Info</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-base-content/70">
                  <UserIcon size={16} />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-2 text-base-content/70">
                  <Calendar size={16} />
                  <span>
                    {user.createdAt
                      ? `Joined ${format(
                          new Date(user.createdAt),
                          'MMMM yyyy'
                        )}`
                      : 'Join date not available'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-base-content/70">
                  <Mail size={16} />
                  <span>{user._count.Blogs} published blogs</span>
                </div>
              </div>
            </div>

            {/* Following Section */}
            {user.Follows.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 text-lg">Following</h3>
                <div className="space-y-4">
                  {user.Follows.map((following) => (
                    <Link
                      href={`/user/${following.id}`}
                      key={following.id}
                      className="flex items-center gap-3 group hover:bg-base-200/50 p-2 rounded-lg transition-colors"
                    >
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          <Image
                            src={following.image || defaultProfile}
                            alt={following.name || 'User'}
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {following.name}
                        </h4>
                        <p className="text-sm text-base-content/70">
                          {following._count.FollowedBy} followers ·{' '}
                          {following._count.Blogs} blogs
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      emailVerified: true,
      _count: {
        select: {
          Blogs: true,
          FollowedBy: true,
          Follows: true,
        },
      },
      Follows: {
        select: {
          id: true,
          name: true,
          image: true,
          _count: {
            select: {
              Blogs: true,
              FollowedBy: true,
            },
          },
        },
        take: 3,
      },
    },
  });

  return user;
}

export default page;
