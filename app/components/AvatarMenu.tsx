'use client';
import React from 'react';
import SignOutBtn from './SignOutBtn';
import {
  ChartNoAxesColumnIncreasing,
  Newspaper,
  Settings,
  SquarePen,
  User,
} from 'lucide-react';
import AvatarMenuBtn from './ui/AvatarMenuBtn';
import Link from 'next/link';
import useClientUser from '@/hooks/useClientUser';

const AvatarMenu = () => {
  const user = useClientUser();
  if (!user) {
    return null;
  }

  return (
    <div className="w-72 sm:w-60 bg-base-200 absolute top-10 right-0 rounded-xl z-20 p-2">
      <Link href={`/user/${user.id}`}>
        <AvatarMenuBtn>
          <User height={20} />
          <p>Profile</p>
        </AvatarMenuBtn>
      </Link>
      <Link href="/dashboard/blogs">
        <AvatarMenuBtn>
          <Newspaper height={20} />
          <p>Blogs</p>
        </AvatarMenuBtn>
      </Link>
      <Link href="/drafts">
        <AvatarMenuBtn>
          <SquarePen height={20} />
          <p>Drafts</p>
        </AvatarMenuBtn>
      </Link>
      <Link href="/stats">
        <AvatarMenuBtn>
          <ChartNoAxesColumnIncreasing height={20} />
          <p>Stats</p>
        </AvatarMenuBtn>
      </Link>{' '}
      <div className="border-t-[1px] border-base-content/10 my-2"></div>
      <Link href="/settings">
        <button className="btn btn-link link-hover btn-neutral flex text-base-content/90 hover:text-base-content">
          <Settings height={20} />
          <p>Settings</p>
        </button>
      </Link>
      <SignOutBtn />
    </div>
  );
};

export default AvatarMenu;
