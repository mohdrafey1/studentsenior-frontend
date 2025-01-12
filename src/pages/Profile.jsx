import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { api, API_KEY } from '../config/apiConfiguration.js';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOut,
} from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import warning from '../../public/assets/warning.png';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);

    const { currentUser, loading, error } = useSelector((state) => state.user);
    useEffect(() => {
        if (image) {
            handleFileUpload(image);
        }
    }, [image]);
    const handleFileUpload = async (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagePercent(Math.round(progress));
            },
            (error) => {
                setImageError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, profilePicture: downloadURL })
                );
            }
        );
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`${api.user}/${currentUser._id}`, {
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
                dispatch(updateUserFailure(data));
                toast.warning(data.message);
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            toast.success('Profile Updated Successfully');
        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error('Something Went Wrong');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(
                `${API_BASE_URL}/api/user/delete/${currentUser._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': API_KEY,
                    },
                }
            );
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error));
        }
    };

    const handleSignOut = async () => {
        try {
            setLoading1(true);
            const response = await fetch(`${api.auth.signout}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                dispatch(signOut());
                navigate('/login');
                setLoading1(false);
                toast.warning('You are Logout Now');
            } else {
                console.error('Signout failed:', response.data);
                toast.error('Signout failed');
            }
        } catch (error) {
            console.error('Signout error:', error);
            toast.error('Signout error');
        } finally {
            setLoading1(false);
        }
    };

    const togglePass = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <>
            {showDialog ? (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-400 z-50 bg-opacity-75 ">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-lg lg:w-1/3 w-2/3 shadow-2xl">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <img
                                    src={warning}
                                    alt="warning icon"
                                    className="p-2"
                                />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <p> Do you want to log out?</p>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        You'll need to log in again to access
                                        your account.
                                    </p>
                                </div>
                                <div className="flex py-4 gap-3 lg:justify-end justify-center ">
                                    <button
                                        className="p-1 py-2 bg-white rounded-lg px-4 border-gray-400 text-sm ring-1 ring-inset ring-gray-300 cursor-pointer"
                                        onClick={() => setShowDialog(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="p-1 py-2 bg-red-600 rounded-lg px-4 border-gray-400 text-sm font-semibold text-white outline-indigo-100 cursor-pointer"
                                        onClick={handleSignOut}
                                        disabled={loading1}
                                    >
                                        {loading1 ? (
                                            <>
                                                <i className="fas fa-spinner fa-pulse"></i>
                                            </>
                                        ) : (
                                            <>Logout</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            <div className="p-3 max-w-lg mx-auto ">
                <h1 className="text-3xl font-semibold text-center my-7">
                    Profile
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative flex justify-center">
                        <input
                            type="file"
                            ref={fileRef}
                            hidden
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <img
                            src={
                                formData.profilePicture ||
                                currentUser.profilePicture
                            }
                            alt="profile"
                            className="h-32 w-32 self-center cursor-pointer rounded-full object-cover border border-sky-300"
                            onClick={() => fileRef.current.click()}
                        />
                        <i
                            className="fa-solid fa-pen absolute top-8 right-1/4 sm:right-1/3 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 p-2 rounded-full cursor-pointer text-gray-700"
                            onClick={() => fileRef.current.click()}
                        ></i>
                    </div>

                    <p className="text-sm self-center">
                        {imageError ? (
                            <span className="text-red-700">
                                Error uploading image (file size must be less
                                than 2 MB)
                            </span>
                        ) : imagePercent > 0 && imagePercent < 100 ? (
                            <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
                        ) : imagePercent === 100 ? (
                            <span className="text-green-700">
                                Image uploaded successfully please click update
                            </span>
                        ) : (
                            ''
                        )}
                    </p>
                    <input
                        defaultValue={currentUser.username}
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="bg-slate-100 rounded-lg p-3"
                        onChange={handleChange}
                    />
                    <input
                        defaultValue={currentUser.email}
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="bg-slate-100 rounded-lg p-3"
                        onChange={handleChange}
                        readOnly
                    />
                    <input
                        defaultValue={currentUser.college}
                        type="text"
                        id="college"
                        placeholder="College Name"
                        className="bg-slate-100 rounded-lg p-3"
                        onChange={handleChange}
                    />
                    <input
                        defaultValue={currentUser.phone}
                        type="number"
                        id="phone"
                        placeholder="Please Enter 10 digit Mobile No"
                        className="bg-slate-100 rounded-lg p-3"
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
                    <button className="bg-sky-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                        {loading ? 'Loading...' : 'Update'}
                    </button>
                </form>
                <div className="flex justify-between mt-5">
                    <span
                        onClick={handleDeleteAccount}
                        className="text-gray-400 cursor-pointer"
                    >
                        <button disabled>Delete Account</button>
                    </span>
                    <span
                        onClick={() => {
                            setShowDialog(true);
                        }}
                        className="text-red-700 cursor-pointer"
                    >
                        Sign out
                    </span>
                </div>
                <p className="text-red-700 mt-5">
                    {error && 'Something went wrong!'}
                </p>
                <p className="text-green-700 mt-5">
                    {updateSuccess && 'User is updated successfully!'}
                </p>
            </div>
            <div className="">
                <div>Reward Balance : {currentUser.rewardBalance}</div>
                <div>Reward Points : {currentUser.rewardPoints}</div>
                <div>Reward Redeemed : {currentUser.rewardRedeemed}</div>
            </div>
        </>
    );
}
