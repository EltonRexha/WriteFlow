import axios from '@/config/axios';
import { UserSchema } from '@/schemas/userSchema';
import { z } from 'zod';
import { ActionError } from '@/types/ActionError';

type User = z.infer<typeof UserSchema>;

interface CreatedUserResponse {
  message: string;
  email: string;
}

export interface ClientUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function createUser(user: User): Promise<CreatedUserResponse> {
  const parsedUser = UserSchema.parse(user);

  const response = await axios.post<CreatedUserResponse>('/users', parsedUser);
  return response.data;
}

export async function getMe(): Promise<ActionError | ClientUser> {
  try {
    const res = await axios.get<ActionError | ClientUser>('/users/me');
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}

export async function getIsFollowed(userId: string): Promise<ActionError | boolean> {
  try {
    const res = await axios.get<ActionError | boolean>(`/users/${userId}/follow`);
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}

export async function followUser(userId: string): Promise<ActionError | { message: string }> {
  try {
    const res = await axios.post<ActionError | { message: string }>(
      `/users/${userId}/follow`
    );
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}

export async function unfollowUser(userId: string): Promise<ActionError | { message: string }> {
  try {
    const res = await axios.delete<ActionError | { message: string }>(
      `/users/${userId}/follow`
    );
    return res.data;
  } catch (err) {
    const data = (err as any)?.response?.data;
    if (data) return data as ActionError;
    throw err;
  }
}
