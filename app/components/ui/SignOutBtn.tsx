'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

const SignOutBtn = () => {
  return (
    <button className="btn btn-link" onClick={() => signOut()}>
      sign out
    </button>
  );
};

export default SignOutBtn;
