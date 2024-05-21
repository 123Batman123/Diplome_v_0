import { createContext, useState, useContext, ReactNode, FC } from 'react'

type TypeAuthContext = {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    isAdmin: boolean
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
}

type PropsAuthContext = {
    children: ReactNode
}

const AuthContext = createContext<TypeAuthContext | undefined>(undefined)

export const AuthProvider: FC<PropsAuthContext> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))

    const isAdminFromLocalStorage = localStorage.getItem('isAdmin')
    const initialIsAdmin = isAdminFromLocalStorage ? JSON.parse(isAdminFromLocalStorage) : false
    const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin)
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }}>
        {children}
      </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider')
    }
    return context
}