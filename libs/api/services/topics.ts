import axios from '@/config/axios';

export interface Topic {
  name: string;
}

const topicsApi = {
  getTopics: async (): Promise<Topic[]> => {
    const res = await axios.get<Topic[]>('/recommendation/topics');
    return res.data;
  },
};

export default topicsApi;
