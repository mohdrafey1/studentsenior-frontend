import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePopup = () => {

    return null;
    // const [showPopup, setShowPopup] = useState(false);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const isPopupShown = localStorage.getItem('popupShown');
    //     if (!isPopupShown) {
    //         setShowPopup(true);
    //         localStorage.setItem('popupShown', 'true');
    //     }
    // }, []);

    // const handleClose = () => {
    //     setShowPopup(false);
    // };

    // const handleDonate = () => {
    //     setShowPopup(false);
    //     navigate('/donation');
    // };

    // return (
    //     <>
    //         {showPopup && (
    //             <div className="fixed inset-0 flex items-center justify-center z-50">
    //                 <div
    //                     className="absolute inset-0 bg-black opacity-50"
    //                     onClick={handleClose}
    //                 ></div>

    //                 <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg z-10">
    //                     <button
    //                         onClick={handleClose}
    //                         className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
    //                     >
    //                         <i className="fa-solid fa-xmark"></i>
    //                     </button>

    //                     <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
    //                         Support Student Senior
    //                     </h1>
    //                     <p className="text-gray-600 mb-6 text-center">
    //                         We strive to provide free resources to students by
    //                         hosting PDFs on AWS. This involves ongoing costs.
    //                         Your donation helps us sustain and grow this
    //                         platform.
    //                     </p>
    //                     <p className="text-gray-600 mb-4 text-center font-semibold">
    //                         Even a small contribution makes a big impact. ❤️
    //                     </p>
    //                     <div className="flex items-center justify-center gap-6">
    //                         <button
    //                             onClick={handleDonate}
    //                             className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg"
    //                         >
    //                             Donate
    //                         </button>
    //                     </div>
    //                 </div>
    //             </div>
    //         )}
    //     </>
    // );
};

export default WelcomePopup;
