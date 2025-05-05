import { Limelight } from 'next/font/google';
import Link from 'next/link';
import clsx from 'clsx';

const limeLight = Limelight({
  weight: '400',
});

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <nav className="md:px-36 bg-base-100">
        <div className="navbar">
          <div className="sm:navbar-start">
            <a
              className={clsx(
                'link link-hover text-xl sm:text-2xl font-bold',
                limeLight.className
              )}
            >
              WriteFlow
            </a>
          </div>
          <div className="flex ml-auto sm:navbar-end">
            <ul className="flex sm:gap-2 items-center px-1">
              <li>
                <Link href="/auth/sign-in">
                  <button className="btn btn-link text-sm">Sign in</button>
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up">
                  <button className="btn btn-primary">Get started</button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}
