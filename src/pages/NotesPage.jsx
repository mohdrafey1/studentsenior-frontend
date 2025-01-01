import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import { api, API_KEY } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import { toast } from 'react-toastify';
import useApiFetch from '../hooks/useApiFetch.js';
import { useCollegeId } from '../hooks/useCollegeId.js';
import pyq from '../../public/assets/pyq.png';
import notesandpyq from '../../public/assets/notes&pyq.png';

const NotesPage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-w-full ">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5 min-h-full">
                <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                    Notes - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center text-xs sm:text-base">
                    "Get concise and clear notes to boost your exam
                    preparation."
                </p>
                <br />
            </div>

            <div className="lg:flex w-full justify-center gap-5">
                <div className="bg-white p-6 rounded-lg shadow-3xl text-center mb-8 lg:w-80 lg:m-0 lg:mb-4 m-4">
                    <img src={pyq} alt="pyq sell" className="w-36 mx-auto" />
                    <p className="mb-4">
                        Get solved questions for just ₹29. <br />
                        <a className="text-sm text-gray-500">
                            Terms and conditions apply.
                        </a>
                    </p>
                    <a
                        target="_blank"
                        href="https://forms.gle/NwFvj1Jz5gxvmHfdA"
                        className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                        Buy Solved Question Paper
                    </a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-3xl text-center mb-8 lg:w-80 lg:m-0 lg:mb-4 m-4">
                    <img
                        src={notesandpyq}
                        alt="pyq upload"
                        className="w-36 mx-auto"
                    />
                    <p className="mb-4">
                        If you have any PYQs or notes, please share them with
                        us.
                    </p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSebji3Hfr-6Volc7KJwk4entnuXH803AAVF1QnHYGPK7AtjPw/viewform?usp=sf_link"
                        className="inline-block px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover transition-colors duration-200"
                        target="_blank"
                    >
                        Click Here To Share PYQs
                    </a>
                </div>
            </div>

            <Collegelink2 />
        </div>
    );
};

export default NotesPage;
