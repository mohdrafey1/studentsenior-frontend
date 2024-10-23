import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';
import { toast } from 'react-toastify';

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data));
                return;
            }
            dispatch(signInSuccess(data));
            toast.success('Sign In successful');
            // Navigate to the correct route after successful login
            const from = location.state?.from?.pathname || '/'; // Default to home if `from` is not set
            navigate(from, { replace: true });
        } catch (error) {
            dispatch(signInFailure(error));
            toast.error('Sign In Failed');
        }
    };

    return (
        <>
            {/* <Header /> */}
            <div className="p-3 max-w-lg mx-auto my-24">
                <h1 className="text-3xl text-center font-semibold my-7">
                    Sign In
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        className="bg-slate-100 p-3 rounded-lg"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        className="bg-slate-100 p-3 rounded-lg"
                        onChange={handleChange}
                    />
                    <button
                        disabled={loading}
                        className="bg-sky-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    >
                        {loading ? 'Loading...' : 'Sign In'}
                    </button>
                    <OAuth />
                </form>
                <div className="flex gap-2 mt-5">
                    <p>Don't Have an account?</p>
                    <Link to="/sign-up">
                        <span className="text-blue-500">Sign up</span>
                    </Link>
                </div>
                <p className="text-red-700 mt-5">
                    {error ? error.message || 'Something went wrong!' : ''}
                </p>
            </div>
        </>
    );
}
