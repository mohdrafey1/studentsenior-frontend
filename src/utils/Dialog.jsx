import React from 'react';

const Dialog = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose} 
        >
            <div 
                className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-lg"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1 text-center">
                        {title}
                    </h3>
                    <i 
                        className="fa-solid fa-xmark cursor-pointer text-2xl text-gray-500"
                        onClick={onClose} 
                    ></i>
                </div>

                <div className="mt-4">{children}</div>
                
                {footer && (
                    <div className="flex justify-center mt-4">{footer}</div>
                )}
            </div>
        </div>
    );
};

export default Dialog;
