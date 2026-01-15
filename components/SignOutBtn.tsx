'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import React from 'react';

const SignOutBtn = () => {
  return (
    <button
      className="btn btn-link link-hover btn-neutral flex text-base-content/90 hover:text-base-content"
      onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
    >
      <LogOut height={20} />
      <p>Sign Out</p>
    </button>
  );
};

export default SignOutBtn;
