import React, { useState, useEffect } from 'react';

const UnderConstructionBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check local storage to see if the message has been dismissed
        const hasDismissed = localStorage.getItem('underConstructionDismissed');
        if (!hasDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        // Set local storage to remember that the user has seen the message
        localStorage.setItem('underConstructionDismissed', 'true');
        setIsVisible(false);
    };

    return (
        isVisible && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-70">
                <div className="bg-sky-500 text-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <div className="flex justify-between items-center">
                        <p>
                            🚧{' '}
                            <strong>We're currently under construction!</strong>
                            Our website is evolving, and some features might not
                            be fully functional yet. We're working hard to
                            improve and expand our offerings. In the meantime,
                        </p>
                        <button
                            onClick={handleClose}
                            className="bg-white text-sky-500 px-4 py-2 rounded ml-4"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default UnderConstructionBanner;
