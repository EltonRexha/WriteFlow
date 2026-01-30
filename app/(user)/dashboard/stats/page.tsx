import React from 'react';
import { Eye, MessageSquare, ThumbsDown, ThumbsUp, TrendingUp, Users, FileText, Activity } from 'lucide-react';
import SearchBlogStats from './_components/SearchBlogStats';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';

export const revalidate = 30;

const page = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-2">Authentication Required</h2>
          <p className="text-base-content/60">You need to be logged in to view stats</p>
        </div>
      </div>
    );
  }

  const [statsPerBlog, statsPerComment] = await Promise.all([
    prisma.blog.findMany({
      where: {
        Author: {
          email: user.email,
        },
      },
      select: {
        _count: {
          select: {
            viewedBy: true,
            BlogComment: true,
            dislikedBy: true,
            likedBy: true,
          },
        },
      },
    }),
    prisma.blogComment.findMany({
      where: {
        Author: {
          email: user.email,
        },
      },
      select: {
        _count: {
          select: {
            dislikedBy: true,
            likedBy: true,
          },
        },
      },
    }),
  ]);

  const totalBlogStats = statsPerBlog.reduce(
    (prev, curr) => {
      return {
        _count: {
          BlogComment: prev._count.BlogComment + curr._count.BlogComment,
          dislikedBy: prev._count.dislikedBy + curr._count.dislikedBy,
          likedBy: prev._count.likedBy + curr._count.likedBy,
          viewedBy: prev._count.viewedBy + curr._count.viewedBy,
        },
      };
    },
    {
      _count: {
        likedBy: 0,
        dislikedBy: 0,
        BlogComment: 0,
        viewedBy: 0,
      },
    }
  );

  const totalCommentStats = statsPerComment.reduce(
    (prev, curr) => {
      return {
        _count: {
          dislikedBy: prev._count.dislikedBy + curr._count.dislikedBy,
          likedBy: prev._count.likedBy + curr._count.likedBy,
        },
      };
    },
    {
      _count: {
        likedBy: 0,
        dislikedBy: 0,
      },
    }
  );

  const totalBlogs = statsPerBlog.length;

  return (
    <div className="min-h-screen bg-base-200/30">
      {/* Hero Section */}
      <div className="bg-base-100 border-b border-base-content/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
                <p className="text-base-content/60">
                  Track your blog performance and engagement
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-base-content/60">Total Blogs</div>
              <div className="text-2xl font-bold text-primary">{totalBlogs}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">

        {/* Overall Stats Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-base-content">Overall Performance</h2>
          </div>
          
          {/* Blog Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {totalBlogStats._count.viewedBy.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Total Views</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {totalBlogStats._count.likedBy.toLocaleString()}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">Total Likes</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-500 rounded-lg">
                  <ThumbsDown className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">
                {totalBlogStats._count.dislikedBy.toLocaleString()}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 mt-1">Total Dislikes</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {totalBlogStats._count.BlogComment.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">Total Comments</div>
            </div>
          </div>
        </div>

        {/* Comment Stats Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-base-content">Comment Engagement</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-emerald-500 rounded-lg">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                {totalCommentStats._count.likedBy.toLocaleString()}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Comment Likes</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <ThumbsDown className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {totalCommentStats._count.dislikedBy.toLocaleString()}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">Comment Dislikes</div>
            </div>
          </div>
        </div>

        {/* Specific Blog Stats */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-base-content">Individual Blog Analysis</h2>
          </div>
          
          <div className="bg-base-200/50 p-6 rounded-xl border border-base-300">
            <SearchBlogStats />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default page;
