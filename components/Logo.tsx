import clsx from "clsx";
import React from "react";
import { Limelight } from "next/font/google";
import Link from "next/link";

const limeLight = Limelight({
  weight: "400",
  subsets: ["latin"],
  preload: true,
});

function Logo() {
  return (
    <Link
      href="/"
      className={clsx(
        "link link-hover text-xl sm:text-2xl font-bold",
        limeLight.className,
      )}
    >
      WriteFlow
    </Link>
  );
}

export default Logo;
