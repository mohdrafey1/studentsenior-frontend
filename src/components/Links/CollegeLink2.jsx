import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../App.css';

const Collegelink2 = () => {
    const { collegeName } = useParams();
    const [isOpen, setisOpen] = useState(false);
    const handleMore = () => {
        if (!isOpen) {
            setisOpen(true);
        } else {
            setisOpen(false);
        }
    };

    return (
        <section className=" lg:hidden min-w-full flex justify-center items-center text-center my-7">
            <div className="fixed z-30 bottom-0 rounded-t-2xl bg-sky-300 inline-flex justify-around items-center text-center w-full py-2">
                <Link
                    to={`/college/${collegeName}`}
                    className="rounded-xl hover:bg-sky-100  px-3 py-2"
                >
                    <div className="flex flex-col items-center min-w-full text-sm">
                        <i className="fa-solid fa-building"></i>
                        <p>College</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/pyq`}
                    className="rounded-xl hover:bg-sky-100  px-3 py-2"
                >
                    <div className="flex flex-col items-center text-sm">
                        <i className="fa-solid fa-bolt"></i>
                        <p>PYQ</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/store`}
                    className="rounded-xl hover:bg-sky-100  px-3 py-2"
                >
                    <div className="flex flex-col items-center text-sm">
                        <i className="fa-solid fa-store"></i>
                        <p>Store</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/community`}
                    className="rounded-xl hover:bg-sky-100  px-3 py-2"
                >
                    <div className="flex flex-col items-center text-sm">
                        <i className="fa-solid fa-users"></i>
                        <p>Community</p>
                    </div>
                </Link>
                <div
                    onClick={handleMore}
                    className="rounded-xl hover:bg-sky-100  px-3 py-2"
                >
                    <div className="flex flex-col items-center text-sm">
                        <i
                            className={`fa-solid ${
                                isOpen ? 'fa-window-close' : 'fa-bars'
                            }`}
                        ></i>
                        <p>{isOpen ? 'Close' : 'More'}</p>
                    </div>
                </div>
            </div>
            {isOpen ? (
                <div
                    className={` fixed inset-0 flex items-center justify-center bg-white z-20 bg-opacity-75`}
                >
                    <ul
                        id="list"
                        className={`bg-sky-300 rounded-b-2xl absolute right-0.5 top-0 z-20 py-3 w-full
                        transition-all duration-700 ease-in-out transform overflow-hidden
                        ${
                            isOpen
                                ? ' opacity-100 translate-y-0'
                                : ' max-h-0 opacity-0 -translate-y-10'
                        }`}
                    >
                        <li className="flex justify-center mb-2">
                            <Link
                                to={`/college/${collegeName}/seniors`}
                                className="rounded-lg hover:bg-sky-100 px-4 py-2 text-center w-11/12"
                            >
                                <div className="flex items-center justify-center space-x-2 text-lg font-bold">
                                    <i className="fa-solid fa-user-tie"></i>
                                    <p>Senior</p>
                                </div>
                            </Link>
                        </li>
                        <li className="flex justify-center mb-2">
                            <Link
                                to={`/${collegeName}/notes`}
                                className="rounded-lg hover:bg-sky-100 px-4 py-2 text-center w-11/12"
                            >
                                <div className="flex items-center justify-center space-x-2 text-lg font-bold">
                                    <i className="fa-solid fa-note-sticky"></i>
                                    <p>Notes</p>
                                </div>
                            </Link>
                        </li>
                        <li className="flex justify-center mb-2">
                            <Link
                                to={`/college/${collegeName}/whatsapp-group`}
                                className="rounded-lg hover:bg-sky-100 px-4 py-2 text-center w-11/12"
                            >
                                <div className="flex items-center justify-center space-x-2 text-lg font-bold">
                                    <i className="fa-brands fa-square-whatsapp"></i>
                                    <p>Groups</p>
                                </div>
                            </Link>
                        </li>
                        <li className="flex justify-center">
                            <Link
                                to={`/college/${collegeName}/opportunities`}
                                className="rounded-lg hover:bg-sky-100 px-4 py-2 text-center w-11/12"
                            >
                                <div className="flex items-center justify-center space-x-2 text-lg font-bold">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    <p>Opportunity</p>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            ) : null}
        </section>
    );
};

export default Collegelink2;
