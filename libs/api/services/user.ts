import axios from '@/config/axios';
import { UserSchema } from '@/schemas/userSchema';
import { z } from 'zod';
import { ResponseError } from '@/types/ResponseError';

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

const userApi = {
  createUser: async (user: User): Promise<CreatedUserResponse> => {
    const parsedUser = UserSchema.parse(user);
    const response = await axios.post<CreatedUserResponse>('/users', parsedUser);
    return response.data;
  },

  getMe: async (): Promise<ResponseError | ClientUser> => {
    const res = await axios.get<ResponseError | ClientUser>('/users/me');
    return res.data;
  },

  getIsFollowed: async (userId: string): Promise<ResponseError | boolean> => {
    const res = await axios.get<ResponseError | boolean>(`/users/${userId}/follow`);
    return res.data;
  },

  followUser: async (userId: string): Promise<ResponseError | { message: string }> => {
    const res = await axios.post<ResponseError | { message: string }>(
      `/users/${userId}/follow`
    );
    return res.data;
  },

  unfollowUser: async (userId: string): Promise<ResponseError | { message: string }> => {
    const res = await axios.delete<ResponseError | { message: string }>(
      `/users/${userId}/follow`
    );
    return res.data;
  },
};

export default userApi;
