import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Collegelinks = () => {
    return (
        <section className="flex justify-center items-center text-center">
            <div className="bg-white h-24 flex justify-between items-center p-10 my-10 gap-12 border-radius-38 text-lg">
                <div className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2">
                    <Link to="seniors" className="">
                        <i class="fa-solid fa-user-tie"></i>
                        <p>Seniors</p>
                    </Link>
                </div>
                <div className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2">
                    <Link to="pyq" className="">
                        <i class="fa-solid fa-bolt"></i>
                        <p>PYQs</p>
                    </Link>
                </div>
                <div className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2">
                    <Link to="store" className="">
                        <i class="fa-solid fa-store"></i>
                        <p>Store</p>
                    </Link>
                </div>
                <div className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2">
                    <Link to="community" className="">
                        <i class="fa-solid fa-users"></i>
                        <p>Community</p>
                    </Link>
                </div>
                <div className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2">
                    <Link to="notes" className="">
                        <i class="fa-solid fa-note-sticky"></i>
                        <p>Notes</p>
                    </Link>
                </div>
                <div className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2">
                    <Link to="whatsapp-group" className="">
                        <i class="fa-brands fa-square-whatsapp"></i>
                        <p>Groups</p>
                    </Link>
                </div>
                <div className="rounded-xl hover:bg-sky-100 w-auto px-4 py-2">
                    <Link to="opportunities" className="">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <p>Opportunities</p>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Collegelinks;
