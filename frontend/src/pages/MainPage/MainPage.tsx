import { NavLink } from "react-router-dom"
import { FileManager } from "../../components/ui/FileManager/FileManager"
import { useAuth } from "../../context/AuthContext"
import { FC } from "react"


export const MainPage: FC = () => {
    const {isAuthenticated} = useAuth()
    
    return (
        <>
            {isAuthenticated ?
                <FileManager />
                :
                <h1><NavLink to="/login">Авторизируйтесь</NavLink></h1>
            }
        </>
    )
}