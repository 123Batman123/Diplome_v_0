import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FC } from 'react'

type PrivateRouteProps = {
    children: React.ReactNode
}

/**
 * Компонент для защиты маршрутов, доступных только для аутентифицированных пользователей и администраторов.
 * @component
 * @param {PrivateRouteProps} props - Свойства компонента.
 * @param {React.ReactNode} props.children - Дочерние элементы, которые будут отображаться, если пользователь аутентифицирован и является администратором.
 * @returns {JSX.Element} Компонент маршрута.
 */
export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    if (!isAdmin) {
        return <Navigate to="/" />
    }

    return <>{children}</>
}
