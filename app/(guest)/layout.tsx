import Link from 'next/link';
import Logo from '@/components/Logo';

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
            <Logo />
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
