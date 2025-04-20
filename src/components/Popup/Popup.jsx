import { useEffect, useState } from "react";

export default function Popup() {
    const [isSeen, setIsSeen] = useState(false);
    const [isReady, setIsReady] = useState(false); // For lazy rendering

    useEffect(() => {
        const seenStatus = localStorage.getItem("popupSeen");
        if (seenStatus === "true") {
            setIsSeen(true);
        }
        setIsReady(true);
    }, []);

    const handleSeen = () => {
        localStorage.setItem("popupSeen", "true");
        setIsSeen(true);
    };

    if (!isReady || isSeen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 sm:mx-6 my-8 sm:my-12 w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-2xl h-[80vh] flex flex-col">
                <div className="flex-grow overflow-hidden">
                    <img
                        src="/assets/offer.jpeg"
                        alt="Popup"
                        className="w-full h-[100%] object-fill rounded-xl"
                    />
                </div>
                <button
                    onClick={handleSeen}
                    className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full text-sm sm:text-base"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
