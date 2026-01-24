import axios from '@/config/axios';
import { ResponseError } from '@/types/ResponseError';

const categoryApi = {
  getCategories: async (): Promise<ResponseError | { name: string }[]> => {
    const res = await axios.get<{ name: string }[]>('/categories');
    return res.data;
  },
};

export default categoryApi;
