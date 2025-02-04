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
                ...(body !== null && {
                    body: isFormData ? body : JSON.stringify(body),
                }),
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (data.statusCode === 401) {
                console.log(response);

                handleLogout();
                toast.error(
                    'Your token is expired, please log in again and continue your request.',
                    { autoClose: 10000 }
                );
                throw new Error('Unauthorized');
            }

            if (data.statusCode === 400) {
                console.log(response);
                toast.error(data.message);
                throw new Error('wrong input');
            }

            return data;
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
