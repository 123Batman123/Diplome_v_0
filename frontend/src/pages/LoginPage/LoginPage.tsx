import { useForm } from "react-hook-form"

import { useNavigate } from "react-router-dom"
import { useMutation } from "react-query"

import { axiosInstance } from "../../services/API"
import { axiosCheckError } from '../../utils/helperFunctions'

import { useAuth } from '../../context/AuthContext'
import { FC } from "react"
import './LoginPage.css'

/**
 * Компонент страницы входа.
 * @component
 * @returns {JSX.Element} JSX элемент для страницы входа.
 */
export const LoginPage: FC = () => {
    const navigate = useNavigate()
    const {setIsAuthenticated, setIsAdmin} = useAuth()
    
    const loginMutation = useMutation(
        /**
         * Асинхронная функция для отправки данных формы входа на сервер.
         * @param {FormValues} data - Данные формы входа.
         * @returns {Promise<any>} Ответ сервера.
         */
        async (data: TypeFormValuesLogin) => {
            const res = await axiosInstance.post('/auth/token/login/', data)
            return res.data
        },
        {
            onSuccess: (postData) => {
                localStorage.setItem('isAdmin', JSON.stringify(postData.is_staff))
                setIsAdmin(postData.is_staff)
                localStorage.setItem('token', postData.auth_token)
                setIsAuthenticated(true)
                navigate('/', {replace: true})
            },
        }
    )

    const {
        register,
        handleSubmit,
        reset, 
        formState: { errors, isValid },
    } = useForm<TypeFormValuesLogin>()

    /**
     * Обработчик отправки формы.
     * @param {FormValues} data - Данные формы входа.
     */
    const onSubmit = async (data: TypeFormValuesLogin) => {
        try {
            reset()
            loginMutation.mutate(data)
        }
        catch (error) {
            console.error("Registration failed:", error)
        }
    }

    return (
        <>
            <h1>Форма авторизации</h1>
            <form className="login-form" action="" onSubmit={handleSubmit(onSubmit)}>
                <label className="label">
                    Username:
                    <input className="input" {...register('username', {
                        required: "Обязательное поле!"
                    })}/>
                </label>
                <div>{errors?.username && <p>{errors?.username?.message || "Error"}</p>}</div>
                <label className="label">
                    Password:
                    <input className="input" {...register('password', {
                        required: "Обязательное поле!"
                    })}/>
                </label>
                <div>{errors?.password && <p>{errors?.password?.message || "Error"}</p>}</div>
                <input className="submit" type="submit" disabled={!isValid}/>
                {loginMutation.isError && (
                    <div className="error-response">
                        <p> { axiosCheckError(loginMutation) } </p>
                    </div>
                )}
            </form>
        </>
    )
}


