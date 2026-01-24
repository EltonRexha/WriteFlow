import { useMe } from '@/hooks/queries/user';
import { isActionError } from '@/types/ActionError';
import type { ClientUser } from '@/libs/api/services/user';

export default function useClientUser() {
  const { data } = useMe();

  if (!data || isActionError(data)) {
    return null;
  }

  return data as ClientUser;
}
