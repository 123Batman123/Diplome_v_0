import { createContext, useState, useContext, ReactNode, FC } from 'react'

/**
 * Тип контекста аутентификации.
 * @typedef {Object} TypeAuthContext
 * @property {boolean} isAuthenticated - Флаг, указывающий, аутентифицирован ли пользователь.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsAuthenticated - Функция для установки флага аутентификации.
 * @property {boolean} isAdmin - Флаг, указывающий, является ли пользователь администратором.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsAdmin - Функция для установки флага администратора.
 */
type TypeAuthContext = {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    isAdmin: boolean
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Тип свойств провайдера контекста аутентификации.
 * @typedef {Object} PropsAuthContext
 * @property {ReactNode} children - Дочерние компоненты.
 */
type PropsAuthContext = {
    children: ReactNode
}

/**
 * Контекст аутентификации.
 * @type {React.Context<TypeAuthContext | undefined>}
 */
const AuthContext = createContext<TypeAuthContext | undefined>(undefined)

/**
 * Провайдер контекста аутентификации.
 * @component
 * @param {PropsAuthContext} props - Свойства провайдера.
 * @returns {JSX.Element} Компонент провайдера аутентификации.
 */
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

/**
 * Хук для использования контекста аутентификации.
 * @throws {Error} Если хук используется вне провайдера AuthProvider.
 * @returns {TypeAuthContext} Контекст аутентификации.
 */
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider')
    }
    return context
}