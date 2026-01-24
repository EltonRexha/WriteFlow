import { useQuery } from '@tanstack/react-query';
import recommendationApi from '@/libs/api/services/recommendation';

export const recommendationQueryKeys = {
  all: ['recommendations'] as const,
  forYou: (page?: number) => [...recommendationQueryKeys.all, 'forYou', page] as const,
  following: (page?: number) => [...recommendationQueryKeys.all, 'following', page] as const,
  topic: (topic: string, page?: number) => [...recommendationQueryKeys.all, 'topic', topic, page] as const,
};

export function useForYouBlogs({ page = 1 }: { page?: number }) {
  return useQuery({
    queryKey: recommendationQueryKeys.forYou(page),
    queryFn: () => recommendationApi.getForYouBlogs(page),
    retry: false,
  });
}

export function useFollowingBlogs({ page = 1 }: { page?: number }) {
  return useQuery({
    queryKey: recommendationQueryKeys.following(page),
    queryFn: () => recommendationApi.getFollowingBlogs(page),
    retry: false,
  });
}

export function useBlogsByTopic({ topic, page = 1 }: { topic: string; page?: number }) {
  return useQuery({
    queryKey: recommendationQueryKeys.topic(topic, page),
    queryFn: () => recommendationApi.getBlogsByTopic(topic, page),
    retry: false,
  });
}
