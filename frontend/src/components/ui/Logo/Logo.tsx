import { NavLink } from 'react-router-dom'
import './logo.css'

export const Logo = () => {
    return (
        <NavLink className="logo" to="/">
            Logo
        </NavLink>
    )
}