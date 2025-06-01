import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-3xl',
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 overflow-y-auto p-4'>
            <div
                className={`bg-white rounded-xl shadow-xl w-full ${maxWidth} overflow-hidden max-h-screen overflow-y-auto scrollbar-hide`}
            >
                {/* Header */}
                <div className='bg-sky-500 text-white px-6 py-4 flex justify-between items-center'>
                    <h4 className='text-xl font-semibold'>{title}</h4>
                    <button
                        onClick={onClose}
                        className='p-1 rounded-full hover:bg-sky-600 transition-colors'
                    >
                        <X size={20} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
};

export default Modal;
