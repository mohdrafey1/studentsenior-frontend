import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { api, API_KEY } from '../config/apiConfiguration.js'; //correction
import { toast } from 'react-toastify';
import Seo from '../components/SEO/Seo.jsx';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(false);
            const res = await fetch(`${api.auth.signup}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            // console.log(data);
            setLoading(false);
            if (data.success === false) {
                toast.error(data.message);
                setError(true);
                return;
            }
            toast.success('Registeration successfull, Please Log In');
            navigate('/sign-in');
        } catch (error) {
            setLoading(false);
            setError(true);
            toast.error('Something Went Wrong');
        }
    };
    const togglePass = () => {
        setPasswordShown(!passwordShown);
    };
    return (
        <>
            <div className="p-3 max-w-lg mx-auto">
                <h1 className="text-3xl text-center font-semibold my-7">
                    Sign Up
                    <Seo title='Sign Up' desc='Create an Account to access all resources' />
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        className="bg-slate-100 p-3 rounded-lg"
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        className="bg-slate-100 p-3 rounded-lg"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="College Name (optional)"
                        id="college"
                        className="bg-slate-100 p-3 rounded-lg"
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        placeholder="Please Enter 10 digit Mobile No (optional)"
                        id="phone"
                        className="bg-slate-100 p-3 rounded-lg"
                        onChange={handleChange}
                    />
                    <div className="w-full flex justify-between">
                        <input
                            type={passwordShown ? 'text' : 'password'}
                            id="password"
                            placeholder="Password"
                            className="bg-slate-100 rounded-lg p-3 w-full"
                            onChange={handleChange}
                        />
                        <i
                            className="fa-solid fa-eye -translate-x-10 w-0 content-center cursor-pointer text-lg"
                            onClick={togglePass}
                        ></i>
                    </div>
                    <button
                        disabled={loading}
                        className="bg-sky-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    >
                        {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                    <OAuth />
                </form>
                <div className="flex gap-2 mt-5 mx-auto justify-center">
                    <p>Have an account?</p>
                    <Link to="/sign-in">
                        <span className="text-blue-500">Sign in</span>
                    </Link>
                </div>
                <p className="text-red-700 mt-5">
                    {error && 'Something went wrong!'}
                </p>
            </div>
        </>
    );
}
