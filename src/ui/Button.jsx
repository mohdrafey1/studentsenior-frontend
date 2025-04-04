import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false,
    ...props
}) => {
    // Define button styles based on the variant
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-sky-600 hover:bg-sky-700 text-white';
            case 'secondary':
                return 'bg-gray-600 hover:bg-gray-700 text-white';
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            case 'outline':
                return 'bg-transparent border border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white';
            default:
                return 'bg-sky-600 hover:bg-sky-700 text-white';
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${getVariantStyles()} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
