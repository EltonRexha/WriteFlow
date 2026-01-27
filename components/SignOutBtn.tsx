"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

const SignOutBtn = () => {
  return (
    <button
      className="btn btn-link link-hover btn-neutral flex items-center justify-start gap-3 btn-lg text-base-content/90 hover:text-base-content w-full"
      onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
    >
      <LogOut height={20} />
      Sign Out
    </button>
  );
};

export default SignOutBtn;
