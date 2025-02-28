import React from 'react';
import { useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import Seo from '../components/SEO/Seo.jsx';

function NotesPage() {
    const { collegeName } = useParams();

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                    Notes - {capitalizeWords(collegeName)}
                    <Seo
                        title={`Lost Found - ${capitalizeWords(collegeName)}`}
                        desc="All subject notes"
                    />
                </h1>
                <p className="italic text-center text-xs sm:text-base">
                    Find your college all notes
                </p>
                <br />
            </div>
            <Collegelink2 />
        </div>
    );
}

export default NotesPage;
