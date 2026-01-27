import Link from "next/link";
import React from "react";

const AvatarMenuBtn = ({
  children,
  href,
}: {
  children: Readonly<React.ReactNode>;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="btn btn-link link-hover btn-neutral flex items-center justify-start gap-3 btn-lg text-base-content/90 hover:text-base-content w-full"
    >
      {children}
    </Link>
  );
};

export default AvatarMenuBtn;
