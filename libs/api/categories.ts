import axios from '@/config/axios';

export async function getCategories(): Promise<{ name: string }[]> {
    const res = await axios.get<{ name: string }[]>('/categories');
    return res.data;
}
