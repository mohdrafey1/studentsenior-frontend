import { useState } from 'react';
import { API_KEY } from '../config/apiConfiguration';

const useApiFetch = () => {
    const [loadingFetch, setLoadingFetch] = useState(false);

    const useFetch = async (url) => {
        setLoadingFetch(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success === 'false') {
                throw new Error(
                    data.message || 'Something error occured on the server'
                );
            }
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        } finally {
            setLoadingFetch(false);
        }
    };

    return { useFetch, loadingFetch };
};

export default useApiFetch;
