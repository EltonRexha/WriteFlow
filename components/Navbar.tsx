import React from 'react';

const Navbar = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <nav className="sm:px-12 lg:px-36 bg-base-100">
      <div className="navbar">{children}</div>
    </nav>
  );
};

export default Navbar;
