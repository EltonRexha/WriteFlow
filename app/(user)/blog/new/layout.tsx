import Link from 'next/link';
import clsx from 'clsx';
import Avatar from '@/components/Avatar';
import Navbar from '@/components/Navbar';
import CreateDraftBtn from '@/app/(user)/blog/new/_components/CreateDraftBtn';
import CreateBlogBtn from '@/app/(user)/blog/new/_components/CreateBlogBtn';
import { Limelight } from 'next/font/google';

const limeLight = Limelight({
  weight: '400',
  subsets: ['latin'],
  preload: true
});


export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <Navbar>
        <div className="sm:navbar-start">
          <Link
            href="/home"
            className={clsx(
              'link link-hover text-xl sm:text-2xl font-bold',
              limeLight.className
            )}
          >
            WriteFlow
          </Link>
        </div>
        <div className="flex ml-auto sm:navbar-end">
          <ul className="flex gap-2 items-center px-1">
            <li>
              <CreateDraftBtn />
            </li>
            <li>
              <CreateBlogBtn />
            </li>
            <li>
              <Avatar />
            </li>
          </ul>
        </div>
      </Navbar>
      <div>{children}</div>
    </div>
  );
}
