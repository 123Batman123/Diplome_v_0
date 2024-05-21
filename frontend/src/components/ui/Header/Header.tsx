import { Logo } from "../Logo/Logo"
import { Nav } from "../Nav/Nav"

import './header.css'

export const Header = () => {
    return (
        <header className="header">
            <Logo />
            <Nav />
        </header>
    )
}