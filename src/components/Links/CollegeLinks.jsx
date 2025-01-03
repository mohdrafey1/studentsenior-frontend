import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../App.css';

const Collegelinks = () => {
    const { collegeName } = useParams();

    return (
        <section className="hidden  lg:flex justify-center items-center text-center my-10 px-4">
            <div className="bg-white border-radius-38 border-2 border-sky-500 flex flex-wrap justify-center items-center text-center px-2 sm:px-10 py-6 gap-10 text-base sm:gap-4 sm:text-lg md:gap-6 md:text-xl lg:gap-7 xl:gap-9">
                <Link
                    to={`/college/${collegeName}`}
                    className="rounded-xl hover:bg-sky-100 w-28 px-4 py-2"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-building"></i>
                        <p>College</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/seniors`}
                    className="rounded-xl hover:bg-sky-100 w-28 px-4 py-2"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-user-tie"></i>
                        <p>Seniors</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/pyq`}
                    className="rounded-xl hover:bg-sky-100 w-28 px-4 py-2"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-bolt"></i>
                        <p>PYQs</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/store`}
                    className="rounded-xl hover:bg-sky-100 w-28 px-4 py-2"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-store"></i>
                        <p>Store</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/community`}
                    className="rounded-xl hover:bg-sky-100 w-28 px-4 py-2"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-users"></i>
                        <p>Community</p>
                    </div>
                </Link>
                <Link
                    to={`/${collegeName}/notes`}
                    className="rounded-xl hover:bg-sky-100 w-28 px-4 py-2"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-note-sticky"></i>
                        <p>Notes</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/whatsapp-group`}
                    className="rounded-xl hover:bg-sky-100 w-28 px-4 py-2"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-brands fa-square-whatsapp"></i>
                        <p>Groups</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/opportunities`}
                    className="rounded-xl hover:bg-sky-100 w-28 px-4 py-2"
                >
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <p>Opportunity</p>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default Collegelinks;
