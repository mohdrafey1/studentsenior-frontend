import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();

    return currentUser ? (
        <Outlet />
    ) : (
        <Navigate to="/sign-in" state={{ from: location }} replace />
    );
}
