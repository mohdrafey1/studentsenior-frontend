import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CollegeLinks from '../components/Links/CollegeLinks';
import { capitalizeWords } from '../utils/Capitalize.js';
import Seo from '../components/SEO/Seo.jsx';
import { api } from '../config/apiConfiguration.js';

function LeaderboardPage() {
    const { collegeName } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [previousWinners, setPreviousWinners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get current month name
    const getMonthName = (monthIndex) => {
        return new Date(2025, monthIndex - 1, 1).toLocaleString('default', {
            month: 'long',
        });
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`${api.leaderboard}`);
                const data = await response.json();

                setLeaderboard(data.leaderboard);
                setPreviousWinners(data.previousWinners);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="container bg-gradient-to-t from-sky-100 to-white min-h-screen min-w-full pb-4">
            <Seo
                title={`Leaderboard`}
                desc="Find Your lost item within college or return a found item."
            />

            {/* Information About Rewards */}
            <div className="bg-sky-50 p-6 rounded-lg lg:mx-20 mx-0 shadow-md mt-8 text-center">
                <h2 className="text-xl font-bold text-sky-800 mb-2">
                    How to Win?
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                    The user who earns the most points in a month wins!
                </p>
                <p className="text-sm text-gray-600 mb-3">
                    ⭐ Upload PYQs, Notes to earn points.
                </p>
                <p className="text-sm font-semibold text-gray-700">
                    🎁 Monthly Winner Reward:{' '}
                    <span className="text-green-600">+500 Points</span>
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-5">
                {loading ? (
                    <div className="flex justify-center items-center my-10">
                        <i className="fas fa-spinner fa-pulse fa-5x text-sky-500"></i>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <p className="text-center mt-5 text-gray-600">
                        No data available yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto lg:w-4/5 mx-auto mt-6">
                        <h2 className="sm:text-2xl font-bold text-center text-sky-800 mb-4">
                            Current Month Leaderboard
                        </h2>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                            <thead className="bg-sky-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        Rank
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Points
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.slice(0, 9).map((user, index) => (
                                    <tr
                                        key={user.userId}
                                        className={`${index === 0
                                            ? 'bg-green-100'
                                            : index % 2 === 0
                                                ? 'bg-gray-50'
                                                : 'bg-white'
                                            } hover:bg-gray-100 transition-colors`}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-700 flex items-center">
                                            {index + 1}
                                            {index === 0 && (
                                                <span className="ml-2 text-yellow-500">
                                                    🏆
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800 ">
                                            <div className='flex items-center gap-4'>
                                                <img src={user.profilePicture} alt={user.username} className='w-10 rounded-full' />
                                                <p>{user.username}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {user.totalPoints}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Previous Winners Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-center text-sky-800 mb-6">
                        Previous 3 Month Winners
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {previousWinners.map((winner, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                            >
                                <p className="text-sm font-semibold text-gray-600">
                                    {getMonthName(winner.month)}
                                </p>
                                <div className='flex flex-col justify-center items-center gap-4'>
                                    <img src={winner.profilePicture} alt={winner.username} className='w-20 rounded-full' />
                                    <p>{winner.username}</p>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    🏆 {winner.points} Points
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default LeaderboardPage;
