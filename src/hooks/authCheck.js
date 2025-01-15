import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice';

const AuthCheck = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = () => {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('access_token='));
            if (!token) {
                dispatch(signOut());
            }
        };

        checkAuth();
    }, [dispatch]);

    return null;
};

export default AuthCheck;
