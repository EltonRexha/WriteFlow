import { Limelight } from 'next/font/google';
import Link from 'next/link';
import clsx from 'clsx';
import Avatar from '../components/Avatar';

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
      <nav className="md:px-36 bg-base-100">
        <div className="navbar">
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
            <ul className="flex sm:gap-2 items-center px-1">
              <li>
                <Link href="/auth/sign-up">
                  <button className="btn btn-primary">Create</button>
                </Link>
              </li>
              <li>
                <Avatar />
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}
