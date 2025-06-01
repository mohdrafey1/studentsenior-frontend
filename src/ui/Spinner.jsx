import { useState, useEffect } from 'react';

export const StudentSeniorSpinner = ({
    isLoading = true,
    size = 'large',
    showText = true,
    className = '',
}) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [dots, setDots] = useState('');

    const messages = [
        'Loading your resources',
        'Preparing study materials',
        'Gathering college info',
        'Almost ready',
    ];

    // Cycle through loading messages
    useEffect(() => {
        if (!showText) return;

        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);

        return () => clearInterval(messageInterval);
    }, [showText]);

    // Animate dots
    useEffect(() => {
        if (!showText) return;

        const dotsInterval = setInterval(() => {
            setDots((prev) => {
                if (prev === '...') return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(dotsInterval);
    }, [showText]);

    if (!isLoading) return null;

    const sizeClasses = {
        small: {
            container: 'p-4',
            spinner: 'w-8 h-8',
            icon: 'text-lg',
            books: 'h-3 w-1',
            text: 'text-sm',
            title: 'text-xs',
        },
        medium: {
            container: 'p-6',
            spinner: 'w-12 h-12',
            icon: 'text-xl',
            books: 'h-4 w-1.5',
            text: 'text-base',
            title: 'text-sm',
        },
        large: {
            container: 'p-10',
            spinner: 'w-20 h-20',
            icon: 'text-2xl',
            books: 'h-5 w-1.5',
            text: 'text-lg',
            title: 'text-sm',
        },
    };

    const classes = sizeClasses[size];

    return (
        <div
            className={`fixed inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-sky-500 flex items-center justify-center z-50 ${className}`}
        >
            <div className={`text-center ${classes.container}`}>
                {/* Book Wave Animation */}
                <div className='flex justify-center gap-2 mb-6'>
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className={`${classes.books} rounded-sm animate-pulse`}
                            style={{
                                backgroundColor: [
                                    '#ff6b6b',
                                    '#4ecdc4',
                                    '#45b7d1',
                                    '#96ceb4',
                                    '#feca57',
                                ][index],
                                animationDelay: `${index * 0.1}s`,
                                animationDuration: '1.4s',
                            }}
                        />
                    ))}
                </div>

                {/* Main Spinner with Graduation Cap */}
                <div className={`relative ${classes.spinner} mx-auto mb-6`}>
                    {/* Spinning Ring */}
                    <div className='absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin' />

                    {/* Graduation Cap Icon */}
                    <div
                        className={`absolute inset-0 flex items-center justify-center ${classes.icon} animate-pulse`}
                    >
                        🎓
                    </div>
                </div>

                {/* Loading Text */}
                {showText && (
                    <>
                        <div
                            className={`text-white font-semibold mb-2 ${classes.text} animate-pulse`}
                        >
                            {messages[messageIndex]}
                            {dots}
                        </div>

                        <div
                            className={`text-white/80 font-light tracking-widest ${classes.title}`}
                        >
                            STUDENT SENIOR
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Compact inline spinner component
export const CompactSpinner = ({
    className = '',
    size = 'large',
    showText = true,
}) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [dots, setDots] = useState('');

    const messages = [
        'Loading your resources',
        'Preparing study materials',
        'Gathering college info',
        'Almost ready',
    ];

    // Cycle through loading messages
    useEffect(() => {
        if (!showText) return;

        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);

        return () => clearInterval(messageInterval);
    }, [showText]);

    // Animate dots
    useEffect(() => {
        if (!showText) return;

        const dotsInterval = setInterval(() => {
            setDots((prev) => {
                if (prev === '...') return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(dotsInterval);
    }, [showText]);

    const sizeClasses = {
        small: {
            container: 'p-2',
            spinner: 'w-6 h-6',
            icon: 'text-sm',
            books: 'h-2 w-0.5',
            text: 'text-xs',
            title: 'text-xs',
        },
        medium: {
            container: 'p-4',
            spinner: 'w-8 h-8',
            icon: 'text-base',
            books: 'h-3 w-1',
            text: 'text-sm',
            title: 'text-xs',
        },
        large: {
            container: 'p-8',
            spinner: 'w-12 h-12',
            icon: 'text-lg',
            books: 'h-4 w-1.5',
            text: 'text-base',
            title: 'text-sm',
        },
    };

    const classes = sizeClasses[size];

    return (
        <div
            className={`inline-flex flex-col items-center mt-10  ${classes.container} ${className}`}
        >
            {/* Book Wave Animation */}
            <div className='flex justify-center gap-1 mb-2'>
                {[0, 1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className={`${classes.books} rounded-sm animate-pulse`}
                        style={{
                            backgroundColor: [
                                '#ff6b6b',
                                '#4ecdc4',
                                '#45b7d1',
                                '#96ceb4',
                                '#feca57',
                            ][index],
                            animationDelay: `${index * 0.1}s`,
                            animationDuration: '1.4s',
                        }}
                    />
                ))}
            </div>

            {/* Main Spinner with Graduation Cap */}
            <div className={`relative ${classes.spinner} mb-2`}>
                {/* Spinning Ring */}
                <div className='absolute inset-0 border-2 border-white/30 border-t-black rounded-full animate-spin' />

                {/* Graduation Cap Icon */}
                <div
                    className={`absolute inset-0 flex items-center justify-center ${classes.icon} animate-pulse`}
                >
                    🎓
                </div>
            </div>

            {/* Loading Text */}
            {showText && (
                <>
                    <div
                        className={` font-semibold mb-1 ${classes.text} animate-pulse text-center`}
                    >
                        {messages[messageIndex]}
                        {dots}
                    </div>

                    <div
                        className={` font-light tracking-wider ${classes.title} text-center`}
                    >
                        STUDENT SENIOR
                    </div>
                </>
            )}
        </div>
    );
};

// Button with built-in spinner
export const LoadingButton = ({
    children,
    isLoading = false,
    onClick,
    className = '',
    ...props
}) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className={`
      relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 
      text-white font-semibold rounded-lg shadow-lg hover:shadow-xl 
      transform hover:scale-105 transition-all duration-200 
      disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
      ${className}
    `}
        {...props}
    >
        {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            </div>
        )}
        <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
            {children}
        </span>
    </button>
);
