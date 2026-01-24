import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import draftApi from '@/libs/api/services/drafts';

export const draftQueryKeys = {
  all: ["drafts"] as const,
  list: (page?: number, limit?: number) => [...draftQueryKeys.all, "list", page, limit] as const,
  detail: (id: string) => [...draftQueryKeys.all, "detail", id] as const,
};

export function useDrafts({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: draftQueryKeys.list(page, limit),
    queryFn: () => draftApi.getDrafts(page, limit),
    retry: false,
  });
}

export function useDraft({ id }: { id: string }) {
  return useQuery({
    queryKey: draftQueryKeys.detail(id),
    queryFn: () => draftApi.getDraft(id),
    retry: false,
  });
}

export function useCreateDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: draftApi.createDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: draftQueryKeys.all });
    },
  });
}

export function useDeleteDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: draftApi.deleteDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: draftQueryKeys.all });
    },
  });
}

export function useUpdateDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ draftId, content }: { draftId: string; content: string }) =>
      draftApi.updateDraft(draftId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: draftQueryKeys.detail(variables.draftId) });
    },
  });
}

export function usePublishDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      draftId,
      blogData,
    }: {
      draftId: string;
      blogData: {
        title: string;
        description: string;
        imageUrl: string;
        categories: string[];
      };
    }) => draftApi.publishDraft(draftId, blogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: draftQueryKeys.all });
    },
  });
}
