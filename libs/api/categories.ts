import axios from '@/config/axios';
import { isResponseError } from '@/types/guards/isResponseError';
import { ResponseError } from '@/types/ResponseError';

export async function getCategories(): Promise<ResponseError | { name: string }[]> {
    try {
        const res = await axios.get<{ name: string }[]>('/categories');
        return res.data;
    } catch (err) {
        if (isResponseError(err)) return err;
        throw err;
    }
}
