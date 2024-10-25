import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, API_KEY } from '../config/apiConfiguration';
import { toast } from 'react-toastify';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [loading, setLoading] = useState(false);

    const handleGoogleClick = async () => {
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch(`${api.auth.google}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data));
            navigate(from);
            toast.success('Log in successfull');
        } catch (error) {
            console.log('Could not login with Google', error);
            toast.error('login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
            disabled={loading}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                    </svg>
                    Logging in...
                </div>
            ) : (
                'Continue with Google'
            )}
        </button>
    );
}
