import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HistoryTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const history = JSON.parse(sessionStorage.getItem('navHistory')) || [];
        if (!history.includes(location.pathname)) {
            history.push(location.pathname);
            sessionStorage.setItem('navHistory', JSON.stringify(history));
        }
    }, [location]);

    return null;
};

export default HistoryTracker;
