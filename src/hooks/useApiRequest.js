import { useState } from 'react';
import { API_KEY } from '../config/apiConfiguration';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../redux/user/userSlice.js';
import { toast } from 'react-toastify';

const useApiRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(signOut());
        navigate('/sign-in');
    };

    const apiRequest = async (url, method, body = null, isFormData = false) => {
        setLoading(true);
        setError(null);

        try {
            const options = {
                method,
                headers: {
                    'x-api-key': API_KEY,
                    ...(isFormData
                        ? {}
                        : { 'Content-Type': 'application/json' }),
                },
                credentials: 'include',
                body: isFormData ? body : JSON.stringify(body),
            };

            const response = await fetch(url, options);

            if (response.ok) {
                const data = await response.json();
                return data;
            } else if (response.status === 401) {
                handleLogout();
                toast.error(
                    'Your token is expired, please log in again and continue your request.',
                    { autoClose: 10000 }
                );
                throw new Error('Unauthorized');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'An error has occurred');
                throw new Error(errorData || 'Something went wrong');
            }
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { apiRequest, loading, error };
};

export default useApiRequest;
