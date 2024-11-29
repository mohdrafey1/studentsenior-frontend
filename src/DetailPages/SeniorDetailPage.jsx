import React, { useEffect, useState } from 'react';
import DetailPageNavbar from './DetailPageNavbar';
import { useParams, Link } from 'react-router-dom';
import { useCollegeId } from '../hooks/useCollegeId';
import { toast } from 'react-toastify';
import useApiFetch from '../hooks/useApiFetch';
import { api } from '../config/apiConfiguration';

function SeniorDetail() {
    const { collegeName, id } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [senior, setSenior] = useState(null);
    const { useFetch, loadingFetch } = useApiFetch();

    const fetchSenior = async () => {
        try {
            const data = await useFetch(`${api.senior}/${id}`);
            setSenior(data);
        } catch (error) {
            console.error(error);
            toast.error('Something error occured');
        }
    };

    useEffect(() => {
        fetchSenior();
    }, [id]);

    if (loadingFetch) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    if (!senior) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Senior Not Found !
                </h1>
                <Link
                    to={`/college/${collegeName}/seniors`}
                    className="mt-6 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    See Other Seniors
                </Link>
            </div>
        );
    }

    return (
        <div className="container bg-gradient-to-t from-sky-200 to-white min-h-screen min-w-full">
            <DetailPageNavbar path="senior" />

            <div className="main grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="md:col-span-1 md:sticky md:top-0 p-4 shadow-md mt-5 items-center md:h-screen">
                    <div className="shadow-md rounded-md md:fixed md:top-48 lg:left-16 xl:left-24">
                        <div className="">
                            <img
                                src={
                                    senior.owner.profilePicture.replace(
                                        '=s96-c',
                                        ''
                                    ) || senior.profilePicture
                                }
                                alt={senior.name}
                                className="h-40 w-40 mx-auto rounded-3xl transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                        <div className="px-3 lg:px-6 py-2 text-center">
                            <h3 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {senior.name}
                            </h3>
                            <p className="text-red-500 font-medium mb-1 text-base">
                                Course: {senior.branch}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-base">
                                Year: {senior.year}
                            </p>
                            <p className="text-gray-500 dark:text-gray-300 text-base ">
                                Domain: {senior.domain}
                            </p>
                        </div>
                        <div className="flex justify-center space-x-4 pb-6">
                            <a
                                target="_blank"
                                href={`https://api.whatsapp.com/send?phone=${senior.whatsapp}`}
                                aria-label="WhatsApp"
                                className="text-green-600 hover:text-green-500 transition"
                            >
                                <i className="fa-brands fa-whatsapp text-2xl sm:text-3xl"></i>
                            </a>
                            {senior.telegram && (
                                <a
                                    target="_blank"
                                    href={`https://t.me/+91${senior.telegram}`}
                                    aria-label="Telegram"
                                    className="text-blue-600 hover:text-blue-500 transition"
                                >
                                    <i className="fa-brands fa-telegram text-2xl sm:text-3xl"></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white p-4 shadow-md rounded-md">
                    <h2 className="text-lg font-semibold">
                        Additional Details (Chatting Feature Coming Soon here)
                    </h2>

                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Tempora odit ex a neque consequatur aut in
                        accusantium quod, optio, fuga tempore, modi cum
                        dignissimos repudiandae at nobis perspiciatis nemo odio.
                    </p>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Aut modi facere, non sunt sint ducimus deserunt
                        illo. Fuga explicabo veritatis neque fugit nihil? dicta
                        culpa aut soluta rerum reiciendis temporibus nemo non
                        blanditiis nobis nostrum tempore quam veniam quaerat
                        voluptas enim est deleniti possimus, inventore officia
                        tenetur ratione. Repellendus. Veritatis nobis culpa
                        obcaecati sint. Totam, illum. Unde atque placeat
                        blanditiis, rem alias ullam! Dolore nobis, natus neque
                        deleniti, suscipit libero optio dolorum sunt enim,
                        nesciunt ullam. Pariatur quisquam animi ea molestiae
                        voluptatibus temporibus laboriosam provident libero.
                        Porro fugiat pariatur enim! Ducimus quibusdam
                        exercitationem fugiat omnis fugit officiis rem velit
                        voluptas nihil, similique natus sequi atque, quis esse
                        at doloribus autem ratione cupiditate consequatur
                        tenetur amet accusantium. Quis dolor autem aliquam
                        fugiat? Eos natus, magni labore dolore itaque odit
                        repellendus ut facilis perspiciatis? Ad. Fugit
                        laudantium ducimus eveniet repellendus. Animi totam
                        repellendus laborum aliquid alias ducimus laudantium
                        quis corporis rem, amet facere! Quo libero odio, velit
                        accusantium voluptates quas soluta tempore eum minus?
                        Maxime.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SeniorDetail;
