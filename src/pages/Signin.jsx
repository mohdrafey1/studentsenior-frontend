import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import { api, API_KEY } from '../config/apiConfiguration.js';
import { toast } from 'react-toastify';
import icon from '../../public/assets/image192.png';
import login from '../../public/assets/login.png';

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const [passwordShown, setPasswordShown] = useState(false);
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
            const res = await fetch(`${api.auth.login}`, {
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
                toast.error(data.message);
                return;
            }
            dispatch(signInSuccess(data));
            toast.success('Sign In successful');
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            dispatch(signInFailure(error));
            toast.error('Sign In Failed');
        }
    };
    const togglePass = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <>
            {/* <Header /> */}
            <div className="lg:flex bg-gradient-to-t from-sky-200 to bg-white">
                <div className="p-3 max-w-lg lg:mx-auto lg:my-5 lg:bg-white lg:w-2/4 md:mx-auto py-10 rounded-xl mx-5 my-10">
                    <img src={icon} alt="logo" className="h-20 w-20 mx-auto" />
                    <h1 className="text-2xl text-center font-semibold mt-7">
                        Welcome Back
                    </h1>
                    <p className="text-center mb-7 text-xs text-slate-800">
                        Please enter your details to sign in
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-0"
                    >
                        <label className="mx-3 my-0">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            id="email"
                            className="bg-slate-100 p-2 ring-1 px-4 rounded-lg mx-3 mb-3"
                            onChange={handleChange}
                        />
                        <label className="mx-3 ">Password</label>
                        <div className="w-full flex justify-between content-center">
                            <input
                                type={passwordShown ? 'text' : 'password'}
                                id="password"
                                placeholder="Password"
                                className="bg-slate-100 p-2 ring-1 px-4 rounded-lg mx-3 mb-3 w-full"
                                onChange={handleChange}
                            />
                            <i
                                className="fa-solid fa-eye -translate-x-10 w-0 content-center mb-2 cursor-pointer text-lg"
                                onClick={togglePass}
                            ></i>
                        </div>
                        <br />
                        <button
                            disabled={loading}
                            className="bg-sky-500 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mx-3"
                        >
                            {loading ? (
                                <i className="fas fa-spinner fa-pulse"></i>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                        <br />
                        <div className="flex">
                            <div className=" h-0.5 bg-slate-400 w-full my-3 ml-4 mr-2 rounded-3xl"></div>
                            or
                            <div className="h-0.5 bg-slate-400 w-full my-3 ml-2 mr-4 rounded-3xl"></div>
                        </div>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 mt-5 justify-center">
                        <p>Don't Have an account?</p>
                        <Link to="/sign-up">
                            <span className="text-blue-500">Sign up</span>
                        </Link>
                    </div>
                </div>
                <div className=" w-2/5 flex content-center">
                    <img
                        src={login}
                        alt="illustrature"
                        className="h-2/3 mx-auto my-auto lg:block hidden"
                    />
                </div>
            </div>
        </>
    );
}
