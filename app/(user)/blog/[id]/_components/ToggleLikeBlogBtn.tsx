"use client";
import { useToggleLikeBlog } from "@/hooks/queries/blog";
import { ThumbsUp } from "lucide-react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { isActionError } from "@/types/ActionError";

const ToggleLikeBtn = ({
  blogId,
  isLiked,
}: {
  blogId: string;
  isLiked: boolean;
}) => {
  const router = useRouter();
  const mutation = useToggleLikeBlog();

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (isActionError(mutation.data)) return;
      router.refresh();
      mutation.reset();
    }
  }, [mutation.isSuccess, mutation.data, router, mutation]);

  const handleLike = async () => {
    mutation.mutate(blogId);
  };

  return (
    <button
      className={clsx(
        "btn btn-circle btn-ghost hover:text-green-500 transition-colors",
        isLiked ? "text-green-500" : "",
      )}
      onClick={handleLike}
    >
      <ThumbsUp height={20} />
    </button>
  );
};

export default ToggleLikeBtn;
