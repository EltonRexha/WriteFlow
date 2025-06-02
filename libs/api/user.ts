import axios from '@/config/axios';
import { UserSchema } from '@/schemas/userSchema';
import { z } from 'zod';

type User = z.infer<typeof UserSchema>;

interface CreatedUserResponse {
  message: string;
  email: string;
}

export async function createUser(user: User): Promise<CreatedUserResponse> {
  const parsedUser = UserSchema.parse(user);

  const response = await axios.post<CreatedUserResponse>('/users', parsedUser);
  return response.data;
}
