import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../App.css';

const Collegelinks = () => {
    const { collegeName } = useParams();

    return (
        <section className="flex justify-center items-center text-center my-10">
            <div className="bg-white h-24 flex justify-between items-center p-10 gap-12 border-radius-38 text-lg">
                <Link
                    to={`/college/${collegeName}`}
                    className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2"
                >
                    <div>
                        <i className="fa-solid fa-building"></i>
                        <p>College</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/seniors`}
                    className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2"
                >
                    <div>
                        <i className="fa-solid fa-user-tie"></i>
                        <p>Seniors</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/pyq`}
                    className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2"
                >
                    <div>
                        <i className="fa-solid fa-bolt"></i>
                        <p>PYQs</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/store`}
                    className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2"
                >
                    <div>
                        <i className="fa-solid fa-store"></i>
                        <p>Store</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/community`}
                    className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2"
                >
                    <div>
                        <i className="fa-solid fa-users"></i>
                        <p>Community</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/notes`}
                    className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2"
                >
                    <div>
                        <i className="fa-solid fa-note-sticky"></i>
                        <p>Notes</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/whatsapp-group`}
                    className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2"
                >
                    <div>
                        <i className="fa-brands fa-square-whatsapp"></i>
                        <p>Groups</p>
                    </div>
                </Link>
                <Link
                    to={`/college/${collegeName}/opportunities`}
                    className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2"
                >
                    <div>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <p>Opportunities</p>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default Collegelinks;
