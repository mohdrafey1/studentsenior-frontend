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
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Something error occured on the server'
                );
            }
            const data = await response.json();
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
