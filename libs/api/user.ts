import axios from '@/config/axios';
import { UserSchema } from '@/schemas/userSchema';
import { z } from 'zod';
import { ResponseError } from '@/types/ResponseError';
import { isResponseError } from '@/types/guards/isResponseError';

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

export async function getMe(): Promise<ResponseError | ClientUser> {
  try {
    const res = await axios.get<ResponseError | ClientUser>('/users/me');
    return res.data;
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function getIsFollowed(userId: string): Promise<ResponseError | boolean> {
  try {
    const res = await axios.get<ResponseError | boolean>(`/users/${userId}/follow`);
    return res.data;
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function followUser(userId: string): Promise<ResponseError | { message: string }> {
  try {
    const res = await axios.post<ResponseError | { message: string }>(
      `/users/${userId}/follow`
    );
    return res.data;
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}

export async function unfollowUser(userId: string): Promise<ResponseError | { message: string }> {
  try {
    const res = await axios.delete<ResponseError | { message: string }>(
      `/users/${userId}/follow`
    );
    return res.data;
  } catch (err) {
    if (isResponseError(err)) return err;
    throw err;
  }
}
