import { NavLink } from 'react-router-dom'
import './logo.css'
import { FC } from 'react'

export const Logo: FC = () => {
    return (
        <NavLink className="logo" to="/">
            Logo
        </NavLink>
    )
}