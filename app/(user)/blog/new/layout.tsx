import { Limelight } from 'next/font/google';
import Link from 'next/link';
import clsx from 'clsx';
import Avatar from '@/app/components/Avatar';
import { Save } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

const limeLight = Limelight({
  weight: '400',
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
              <Link href="/blog/new">
                <button className="btn btn-sm btn-secondary btn-ghost">
                  <Save className="join-item" height={15} width={15} />
                  Save
                </button>
              </Link>
            </li>
            <li>
              <Link href="/blog/new">
                <button className="btn btn-sm btn-soft btn-primary">
                  Publish
                </button>
              </Link>
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
