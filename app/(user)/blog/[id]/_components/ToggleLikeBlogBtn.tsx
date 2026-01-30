"use client";
import { useToggleLikeBlog } from "@/hooks/queries/blog";
import { ThumbsUp } from "lucide-react";
import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { isActionError } from "@/types/ActionError";
import useClientUser from "@/hooks/useClientUser";

const ToggleLikeBtn = ({
  blogId,
  isLiked,
}: {
  blogId: string;
  isLiked: boolean;
}) => {
  const router = useRouter();
  const user = useClientUser();
  const isAuthenticated = !!user;
  const mutation = useToggleLikeBlog();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) return;
      router.refresh();
      mutation.reset();
    }
  }, [mutation.isSuccess, mutation.data, router, mutation]);

  const handleLike = useCallback(() => {
    if (!isAuthenticated) return;
    mutation.mutate(blogId);
  }, [mutation, blogId, isAuthenticated]);

  return (
    <button
      className={clsx(
        "btn btn-circle btn-ghost hover:text-green-500 transition-colors",
        isLiked ? "text-green-500" : "",
        !isAuthenticated && "cursor-not-allowed"
      )}
      onClick={handleLike}
      disabled={mutation.isPending || !isAuthenticated}
      title={!isAuthenticated ? "Sign in to like blogs" : ""}
      style={!isAuthenticated ? { color: "inherit" } : {}}
    >
      {mutation.isPending ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <ThumbsUp height={20} />
      )}
    </button>
  );
};

export default ToggleLikeBtn;
