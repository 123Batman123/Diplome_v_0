import { Outlet } from "react-router-dom"
import { Header } from "../Header/Header"
import { Footer } from "../Footer/Footer"

import './layout.css'

export const Layout = () => {
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