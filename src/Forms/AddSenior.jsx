import React, { useReducer, useState, useCallback } from 'react';
import useApiRequest from '../hooks/useApiRequest';
import { api } from '../config/apiConfiguration.js';
import { colleges } from '../hooks/useCollegeId.js';
import useRequireLogin from '../hooks/useRequireLogin.js';
import Seo from '../components/SEO/Seo.jsx';

const initialState = {
    name: '',
    branch: '',
    year: '',
    domain: '',
    whatsapp: '',
    telegram: '',
    college: '',
};

const reducer = (state, action) => ({
    ...state,
    [action.name]: action.value,
});

const AddSeniorPage = () => {
    const requireLogin = useRequireLogin();
    const [isSuccess, setIsSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [senior, dispatch] = useReducer(reducer, initialState);
    const { apiRequest, loading } = useApiRequest();
    const url = api.senior;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch({ name, value: type === 'checkbox' ? checked : value });
    };

    const closeDialog = () => {
        setIsSuccess(false);
        window.location.href = '../';
    };

    const handleSubmit = useCallback(async () => {
        try {
            const response = await apiRequest(url, 'POST', senior);
            setResponseMessage(response.message);
            setIsSuccess(true);
        } catch (err) {
            setResponseMessage(err.message || 'Failed to submit your request.');
        }
    }, [senior, apiRequest]);

    const handleAddSenior = (e) => {
        e.preventDefault();
        requireLogin(handleSubmit);
    };

    return (
        <div className='bg-gradient-to-b from-sky-100 via-blue-50 to-white min-h-screen'>
            {loading && (
                <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'>
                    <div className='animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-sky-500'></div>
                </div>
            )}

            {isSuccess && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <div className='bg-white p-6 rounded-xl shadow-2xl max-w-md mx-4 relative overflow-hidden'>
                        <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-600'></div>
                        <button
                            className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors'
                            onClick={closeDialog}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                className='h-6 w-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </button>
                        <div className='flex items-center justify-center mb-4'>
                            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-7 w-7 text-green-600'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M5 13l4 4L19 7'
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className='text-xl font-bold text-center text-gray-800'>
                            Success
                        </h2>
                        <p className='text-gray-600 mt-2 text-center'>
                            {responseMessage}
                        </p>
                        <div className='mt-5 text-center'>
                            <button
                                className='px-5 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors shadow-md'
                                onClick={closeDialog}
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='container mx-auto px-4 py-6'>
                <div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden'>
                    <div className='lg:flex'>
                        <div className='lg:w-1/2 bg-gradient-to-br from-sky-50 to-blue-100 p-2 flex items-center'>
                            <iframe
                                className='w-full h-80 lg:h-full rounded-lg'
                                src='https://lottie.host/embed/13b6a2bb-8ee5-485e-a88d-ed9c5b3f6977/b9HuPP23fO.json'
                                title='Mentor Animation'
                            ></iframe>
                        </div>
                        <div className='lg:w-1/2 p-8'>
                            <div className='text-center mb-6'>
                                <h1 className='text-3xl font-bold text-sky-700'>
                                    Join As a Senior
                                </h1>
                                <p className='text-gray-600 mt-2'>
                                    Share your knowledge and guide junior
                                    students
                                </p>
                                <Seo
                                    title='Join As a Senior'
                                    desc='Apply for Senior and help students in their academic journey'
                                />
                            </div>

                            <form
                                onSubmit={handleAddSenior}
                                className='space-y-4'
                            >
                                <div className='grid md:grid-cols-2 gap-4'>
                                    {[
                                        {
                                            label: 'Name',
                                            name: 'name',
                                            type: 'text',
                                            placeholder: 'Your full name',
                                            required: true,
                                            className: 'md:col-span-2',
                                        },
                                        {
                                            label: 'Course/Branch',
                                            name: 'branch',
                                            type: 'text',
                                            placeholder:
                                                'e.g. Computer Science',
                                            required: true,
                                        },
                                        {
                                            label: 'Year',
                                            name: 'year',
                                            type: 'select',
                                            required: true,
                                            options: [
                                                '1st Year',
                                                '2nd Year',
                                                '3rd Year',
                                                '4th Year',
                                                '5th Year',
                                                'Alumni',
                                            ],
                                        },
                                        {
                                            label: 'Expertise',
                                            name: 'domain',
                                            type: 'text',
                                            placeholder:
                                                'Your area of expertise',
                                            required: true,
                                            className: 'md:col-span-2',
                                        },
                                        {
                                            label: 'Whatsapp',
                                            name: 'whatsapp',
                                            type: 'number',
                                            placeholder: 'Your WhatsApp number',
                                            required: true,
                                        },
                                        {
                                            label: 'Telegram (Optional)',
                                            name: 'telegram',
                                            type: 'number',
                                            placeholder: 'Your Telegram number',
                                        },
                                    ].map(
                                        ({
                                            label,
                                            name,
                                            type,
                                            placeholder,
                                            required,
                                            className,
                                            options,
                                        }) => (
                                            <div
                                                key={name}
                                                className={className || ''}
                                            >
                                                <label className='block text-gray-700 font-medium mb-1.5'>
                                                    {label}
                                                    {required && (
                                                        <span className='text-red-500 ml-1'>
                                                            *
                                                        </span>
                                                    )}
                                                </label>
                                                {type === 'select' ? (
                                                    <select
                                                        name={name}
                                                        value={senior[name]}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-white'
                                                        required={required}
                                                    >
                                                        <option value=''>
                                                            Select {label}
                                                        </option>
                                                        {options.map(
                                                            (option) => (
                                                                <option
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={type}
                                                        name={name}
                                                        value={senior[name]}
                                                        placeholder={
                                                            placeholder
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-500'
                                                        required={required}
                                                    />
                                                )}
                                            </div>
                                        )
                                    )}

                                    <div className='md:col-span-2'>
                                        <label className='block text-gray-700 font-medium mb-1.5'>
                                            College
                                            <span className='text-red-500 ml-1'>
                                                *
                                            </span>
                                        </label>
                                        <select
                                            name='college'
                                            value={senior.college}
                                            onChange={handleInputChange}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-white'
                                            required
                                        >
                                            <option value=''>
                                                Select Your College
                                            </option>
                                            {colleges.map(({ id, name }) => (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='flex justify-between mt-6 pt-2'>
                                    <button
                                        type='button'
                                        className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300'
                                        onClick={() => window.history.back()}
                                    >
                                        Go Back
                                    </button>

                                    <button
                                        type='submit'
                                        className='px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors shadow-md'
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSeniorPage;
