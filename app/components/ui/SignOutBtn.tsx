'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

const SignOutBtn = () => {
  return (
    <button className="btn btn-ghost btn-neutral w-full" onClick={() => signOut()}>
      Sign Out
    </button>
  );
};

export default SignOutBtn;
