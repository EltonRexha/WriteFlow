import React from 'react';

const AvatarMenuBtn = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <button className="btn btn-link link-hover btn-neutral flex btn-lg text-base-content/90 hover:text-base-content">
      {children}
    </button>
  );
};

export default AvatarMenuBtn;
