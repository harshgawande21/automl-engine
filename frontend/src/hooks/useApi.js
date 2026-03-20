import { useCallback, useState } from 'react';
import api from '../config/axiosConfig';

export function useApi() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, payload = null, config = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api({ method, url, data: payload, ...config });
            setData(response.data);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Something went wrong';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url, config) => request('get', url, null, config), [request]);
    const post = useCallback((url, payload, config) => request('post', url, payload, config), [request]);
    const put = useCallback((url, payload, config) => request('put', url, payload, config), [request]);
    const del = useCallback((url, config) => request('delete', url, null, config), [request]);

    return { data, loading, error, get, post, put, del, setError };
}

export default useApi;
