import React from 'react';
import SignOutBtn from './ui/SignOutBtn';

const AvatarMenu = () => {
  return (
    <div className="w-72 sm:w-32 bg-base-200 absolute top-10 right-0 rounded-xl z-20">
      <SignOutBtn />
    </div>
  );
};

export default AvatarMenu;
