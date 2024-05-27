import { NavLink } from "react-router-dom"

import './nav.css'
import { useAuth } from "../../../context/AuthContext"
import { getLogout } from "../../../services/API"
import { FC } from "react"

/**
 * Компонент навигации.
 * @component
 * @returns {JSX.Element} Компонент навигации.
 */
export const Nav: FC = () => {
    const active = ({ isActive }: { isActive: boolean }) => isActive ? "nav__link-active" : ""
    const {isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin} = useAuth()
    /**
     * Обработчик выхода из системы.
     * Устанавливает аутентификацию и флаг администратора в false, очищает локальное хранилище и выполняет запрос на выход.
     */
    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        setIsAdmin(false)
        localStorage.removeItem('isAdmin')
        getLogout()
    }

    return (
        <nav className="nav">
            <ul className="nav__items">
                <li className="nav__item">
                    <NavLink className={active} to="/">
                        Home
                    </NavLink>
                </li>
                {isAdmin && 
                    <li className="nav__item">
                        <NavLink className={active} to="/admin/users" >
                            Admin
                        </NavLink>
                    </li>
                }
                {isAuthenticated ? 
                <>
                    <li className="nav__item">
                        <NavLink to="/login" onClick={handleLogout}>
                            Logout
                        </NavLink>
                    </li>
                    
                </>
                :
                <>
                    <li className="nav__item">
                        <NavLink className={active} to='/login'>
                            Вход
                        </NavLink>
                    </li>
                    <li className="nav__item">
                        <NavLink className={active} to='/signup'>
                            Регистрация
                        </NavLink>
                    </li>
                </>
            }
            </ul>
        </nav>
    )
}