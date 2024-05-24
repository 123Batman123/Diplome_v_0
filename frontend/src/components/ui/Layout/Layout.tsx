import { Outlet } from "react-router-dom"
import { Header } from "../Header/Header"
import { Footer } from "../Footer/Footer"

import './layout.css'
import { FC } from "react"

export const Layout: FC = () => {
		return (
			<div className="site-container">
				<Header />
				<main>
					<Outlet />
				</main>
				<Footer />
			</div>
		)
}