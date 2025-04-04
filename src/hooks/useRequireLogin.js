import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const useRequireLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useSelector((state) => state.user.currentUser);

    const requireLogin = (action) => {
        if (!currentUser) {
            toast.warning('You need to be logged in to perform this action.');
            navigate('/sign-in', { state: { from: location } });
        } else if (action) {
            action();
        }
    };

    return requireLogin;
};

export default useRequireLogin;
