import React from 'react';
import BlogList from './_components/BlogList';
import { getServerSession } from 'next-auth';
import { FileText, TrendingUp, Eye, AlertCircle, Home } from 'lucide-react';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Link from 'next/link';

const page = async () => {
  const user = await getServerSession(authOptions);

  if (!user?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 mx-auto text-warning" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-base-content/70 mb-6">
            Please sign in to access your blog dashboard and manage your published articles.
          </p>
          <div className="space-y-3">
            <Link href="/auth/sign-in" className="btn btn-primary w-full">
              Sign In
            </Link>
            <Link href="/home" className="btn btn-ghost w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/30">
      {/* Hero Section */}
      <div className="bg-base-100 border-b border-base-content/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Your Blogs</h1>
                <p className="text-base-content/60">
                  Manage and track your published articles
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-base-content/60">Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-info" />
                <span className="text-base-content/60">Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <BlogList user={user.user} />
        </div>
      </div>
    </div>
  );
};

export default page;
