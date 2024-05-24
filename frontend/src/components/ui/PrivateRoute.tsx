import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FC } from 'react';

type PrivateRouteProps = {
    children: React.ReactNode;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};
