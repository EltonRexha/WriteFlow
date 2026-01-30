'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import defaultProfile from '@/public/profile.svg';
import Image from 'next/image';
import { format } from 'date-fns';
import ToggleLikeComment from './ToggleLikeCommentBtn';
import ToggleDislikeComment from './ToggleDislikeCommentBtn';
import type { Comment } from '@/libs/api/services/comments';
import Link from 'next/link';
import { useToggleDislikeComment, useToggleLikeComment } from '@/hooks/queries/comments';
import { isActionError } from '@/types/ActionError';

type ReactionStatus = 'none' | 'liked' | 'disliked';

type Snapshot = {
  status: ReactionStatus;
  likedCount: number;
  dislikedCount: number;
};

type ReactionState = {
  status: ReactionStatus;
  likedCount: number;
  dislikedCount: number;
};

const BlogComment = ({
  id,
  content,
  Author: { id: authorId, image, name: authorName },
  createdAt,
  _count,
  isLiked = false,
  isDisliked = false,
}: Comment) => {
  const [state, setState] = useState<ReactionState>(() => ({
    status: isLiked ? 'liked' : isDisliked ? 'disliked' : 'none',
    likedCount: _count.likedBy,
    dislikedCount: _count.dislikedBy,
  }));

  const snapshotRef = useRef<Snapshot | null>(null);

  const likeMutation = useToggleLikeComment();
  const dislikeMutation = useToggleDislikeComment();

  const isBusy = likeMutation.isPending || dislikeMutation.isPending;

  const rollback = useCallback(() => {
    if (!snapshotRef.current) return;
    const snap = snapshotRef.current;
    setState({
      status: snap.status,
      likedCount: snap.likedCount,
      dislikedCount: snap.dislikedCount,
    });
    snapshotRef.current = null;
  }, []);

  const commit = useCallback(() => {
    snapshotRef.current = null;
  }, []);

  const applyLikeOptimistic = useCallback(() => {
    snapshotRef.current = {
      status: state.status,
      likedCount: state.likedCount,
      dislikedCount: state.dislikedCount,
    };

    setState((prev) => {
      if (prev.status === 'liked') {
        return {
          status: 'none',
          likedCount: Math.max(0, prev.likedCount - 1),
          dislikedCount: prev.dislikedCount,
        };
      }

      if (prev.status === 'disliked') {
        return {
          status: 'liked',
          likedCount: prev.likedCount + 1,
          dislikedCount: Math.max(0, prev.dislikedCount - 1),
        };
      }

      return {
        status: 'liked',
        likedCount: prev.likedCount + 1,
        dislikedCount: prev.dislikedCount,
      };
    });
  }, [state.dislikedCount, state.likedCount, state.status]);

  const applyDislikeOptimistic = useCallback(() => {
    snapshotRef.current = {
      status: state.status,
      likedCount: state.likedCount,
      dislikedCount: state.dislikedCount,
    };

    setState((prev) => {
      if (prev.status === 'disliked') {
        return {
          status: 'none',
          likedCount: prev.likedCount,
          dislikedCount: Math.max(0, prev.dislikedCount - 1),
        };
      }

      if (prev.status === 'liked') {
        return {
          status: 'disliked',
          likedCount: Math.max(0, prev.likedCount - 1),
          dislikedCount: prev.dislikedCount + 1,
        };
      }

      return {
        status: 'disliked',
        likedCount: prev.likedCount,
        dislikedCount: prev.dislikedCount + 1,
      };
    });
  }, [state.dislikedCount, state.likedCount, state.status]);

  const handleLike = useCallback(() => {
    if (isBusy) return;
    applyLikeOptimistic();
    likeMutation.mutate(id, {
      onError: rollback,
      onSuccess: (res) => {
        if (res && isActionError(res)) {
          rollback();
          return;
        }
        commit();
      },
    });
  }, [applyLikeOptimistic, commit, id, isBusy, likeMutation, rollback]);

  const handleDislike = useCallback(() => {
    if (isBusy) return;
    applyDislikeOptimistic();
    dislikeMutation.mutate(id, {
      onError: rollback,
      onSuccess: (res) => {
        if (res && isActionError(res)) {
          rollback();
          return;
        }
        commit();
      },
    });
  }, [applyDislikeOptimistic, commit, dislikeMutation, id, isBusy, rollback]);

  useEffect(() => {
    setState({
      status: isLiked ? 'liked' : isDisliked ? 'disliked' : 'none',
      likedCount: _count.likedBy,
      dislikedCount: _count.dislikedBy,
    });
  }, [isDisliked, isLiked, _count.dislikedBy, _count.likedBy]);

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center space-x-2 mt-4">
        <Link href={`/user/${authorId}`}>
          <div className="w-8 aspect-square relative cursor-pointer ">
            {!image ? (
              <Image
                src={defaultProfile}
                alt="user picture"
                fill
                quality={50}
                className="rounded-full"
              />
            ) : (
              <Image
                src={image}
                alt="user picture"
                fill
                quality={50}
                className="rounded-full"
              />
            )}
          </div>
        </Link>
        <Link href={`/user/${authorId}`} className="text-primary">
          {authorName}
        </Link>
        <p className="text-base-content/60 text-sm">
          {format(new Date(createdAt as Date), 'PPP')}
        </p>
      </div>
      <div className="ml-1 min-w-0">
        <p className="text-base-content/80 break-words whitespace-pre-wrap">{content}</p>
      </div>
      <div className="flex space-x-2 items-center">
        <div className="flex items-center gap-1">
          <ToggleLikeComment
            isLiked={state.status === 'liked'}
            commentId={id}
            onLike={() => {}}
            onClick={handleLike}
            disabled={isBusy}
          />
          <p className="text-sm text-base-content/70">{state.likedCount}</p>
        </div>
        <div className="flex items-center gap-1">
          <ToggleDislikeComment
            isDisliked={state.status === 'disliked'}
            commentId={id}
            onDislike={() => {}}
            onClick={handleDislike}
            disabled={isBusy}
          />
          <p className="text-sm text-base-content/70">{state.dislikedCount}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogComment;
