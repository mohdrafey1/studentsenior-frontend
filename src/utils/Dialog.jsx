import React from 'react';

const Dialog = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-25 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-lg">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h3>
                </div>
                <div className="mt-4">{children}</div>
                {footer && <div className="mt-4">{footer}</div>}
            </div>
        </div>
    );
};

export default Dialog;
