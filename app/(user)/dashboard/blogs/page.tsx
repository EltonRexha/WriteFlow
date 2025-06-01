import React from 'react';
import BlogList from './_components/BlogList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const page = async () => {
  const user = await getServerSession(authOptions);

  if (!user?.user) {
    return 'something went wrong';
  }

  return (
    <div>
      <BlogList user={user.user} />
    </div>
  );
};

export default page;
