"use client";
import React from "react";
import SignOutBtn from "./SignOutBtn";
import {
  ChartNoAxesColumnIncreasing,
  Newspaper,
  Settings,
  SquarePen,
  User,
} from "lucide-react";
import AvatarMenuBtn from "./ui/AvatarMenuBtn";
import useClientUser from "@/hooks/useClientUser";

const AvatarMenu = () => {
  const user = useClientUser();

  return (
    <div className="w-72 sm:w-60 bg-base-200 absolute top-10 right-0 rounded-xl z-20 p-2">
      <AvatarMenuBtn href={`/user/${user?.id}`}>
        <User height={20} />
        Profile
      </AvatarMenuBtn>
      <AvatarMenuBtn href="/dashboard/blogs">
        <Newspaper height={20} />
        Blogs
      </AvatarMenuBtn>
      <AvatarMenuBtn href="/dashboard/drafts">
        <SquarePen height={20} />
        Drafts
      </AvatarMenuBtn>
      <AvatarMenuBtn href="/dashboard/stats">
        <ChartNoAxesColumnIncreasing height={20} />
        Stats
      </AvatarMenuBtn>
      <div className="border-t-[1px] border-base-content/10 my-2"></div>
      <AvatarMenuBtn href="/settings">
        <Settings height={20} />
        Settings
      </AvatarMenuBtn>
      <SignOutBtn />
    </div>
  );
};

export default AvatarMenu;
