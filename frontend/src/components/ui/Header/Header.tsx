import { FC } from "react"
import { Logo } from "../Logo/Logo"
import { Nav } from "../Nav/Nav"

import './header.css'

export const Header: FC = () => {
    return (
        <header className="header">
            <Logo />
            <Nav />
        </header>
    )
}