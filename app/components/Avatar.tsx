'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import AvatarMenu from './AvatarMenu';
import defaultProfile from '@/public/profile.svg';

const Avatar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const session = useSession();
  const image = session?.data?.user?.image;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div className="avatar relative">
        <div
          className="w-8 rounded-full relative cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          {!image ? (
            <Image src={defaultProfile} alt="user picture" fill quality={50} />
          ) : (
            <Image src={image} alt="user picture" fill quality={50} />
          )}
        </div>
      </div>
      {showMenu && <AvatarMenu />}
    </div>
  );
};

export default Avatar;
