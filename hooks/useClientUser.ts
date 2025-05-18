import { User } from '@/app/generated/prisma';
import { getUser } from '@/server-actions/user/action';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function useClientUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getSessionUser() {
      const session = await getSession();
      const sessionEmail = session?.user?.email;
      if (sessionEmail) {
        const user = await getUser({ email: sessionEmail });
        setUser(user);
      }
    }

    getSessionUser();
  }, []);

  return user;
}
