import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBranches } from '../../redux/slices/branchSlice.js';
import { capitalizeWords } from '../../utils/Capitalize.js';
import DetailPageNavbar from '../../DetailPages/DetailPageNavbar.jsx';
import Seo from '../SEO/Seo.jsx';
import { CompactSpinner } from '../../ui/Spinner.jsx';

const Branches = () => {
    const { collegeName, courseCode } = useParams();
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();

    const { branches, loading, error } = useSelector(
        (state) => state.branches || {}
    );

    useEffect(() => {
        dispatch(fetchBranches(courseCode));
    }, [collegeName, courseCode]);

    const filteredBranches = branches.filter((branch) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            branch.branchName.toLowerCase().includes(lowerSearchTerm) ||
            branch.branchCode.toLowerCase().includes(lowerSearchTerm)
        );
    });

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <DetailPageNavbar path={`college/${collegeName}/resources`} />
                <div className='col-span-full flex justify-center h-screen py-12 w-full'>
                    <div className='text-center'>
                        <CompactSpinner size='large' />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <div>
                    <p className='text-center text-red-500 mb-4'>{error}</p>
                    <Link
                        to={`/${collegeName}/resources/${courseCode}`}
                        className='bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600'
                    >
                        See Other Course
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4 min-h-screen'>
            <DetailPageNavbar path={`college/${collegeName}/resources`} />
            <h1 className='sm:text-2xl font-bold text-center mb-2'>
                {capitalizeWords(collegeName)}: {courseCode.toUpperCase()}
                <Seo
                    title={`${capitalizeWords(
                        collegeName
                    )} : ${courseCode.toUpperCase()}`}
                />
            </h1>
            {/* Search Input */}
            <div className='mb-2 flex justify-center'>
                <input
                    type='text'
                    placeholder='Search by Branch Name or Code'
                    className='border border-gray-300 px-4 py-2 rounded-lg shadow-md w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='overflow-x-auto lg:mx-20 xl:mx-40'>
                <table className='table-auto w-full bg-white rounded-lg shadow-md overflow-hidden'>
                    <thead className='bg-sky-500 text-white'>
                        <tr>
                            <th className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left'>
                                Branch Name
                            </th>
                            <th className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left'>
                                Code
                            </th>
                            <th className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left'>
                                Total Notes / Pyqs
                            </th>
                            <th className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2 text-left'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBranches.map((branch) => (
                            <tr key={branch._id} className='hover:bg-gray-100'>
                                <td className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2'>
                                    <Link
                                        to={`${branch.branchCode.toLowerCase()}?semester=1`}
                                    >
                                        {branch.branchName}
                                    </Link>
                                </td>
                                <td className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2'>
                                    <Link
                                        to={`${branch.branchCode.toLowerCase()}?semester=1`}
                                    >
                                        {branch.branchCode || 'N/A'}
                                    </Link>
                                </td>
                                <td className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2'>
                                    {branch.totalNotes || 0} /{' '}
                                    {branch.totalPyqs || 0}
                                </td>
                                <td className='border border-gray-300 px-2 text-xs sm:text-lg sm:px-4 py-2'>
                                    <Link
                                        to={`${branch.branchCode.toLowerCase()}?semester=1`}
                                        className='px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors duration-200'
                                        aria-label={`View details for ${branch.branchName}`}
                                    >
                                        Explore
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Branches;
