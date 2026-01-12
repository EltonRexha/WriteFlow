import { useQuery } from '@tanstack/react-query';
import { getMe, type ClientUser } from '@/libs/api/user';
import { isActionError } from '@/types/ActionError';

export default function useClientUser() {
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  });

  if (!data || isActionError(data)) {
    return null;
  }

  return data as ClientUser;
}
