import { useForm } from "react-hook-form"

import './LoginPage.css'

import { useNavigate } from "react-router-dom"
import { useMutation } from "react-query"

import { axiosInstance } from "../../services/API"
import { axiosCheckError } from '../../utils/helperFunctions'

import { useAuth } from '../../context/AuthContext'

export const LoginPage = () => {
    const navigate = useNavigate()
    const {isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin} = useAuth()
    console.log('login Page')
    const loginMutation = useMutation(
        async (data: TypeFormValuesLogin) => {
            console.log('login', data)
            const res = await axiosInstance.post('/auth/token/login/', data)
            const postData = res.data
            console.log('postData', postData)
            return postData
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
        formState: {
            errors,
            isValid
        },
    } = useForm<TypeFormValuesLogin>()

    const onSubmit = async (data: TypeFormValuesLogin) => {
        try {
            // reset() ВКЛЮЧИТЬ В ПРОДЕ!!!
            console.log('mutate',data)
            loginMutation.mutate(data)
        }
        catch (error) {
            console.error("Registration failed:", error)
        }
    }

    // console.log(data1)
    // console.log('isAdmin после всего', isAdmin)
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
                {/* <button onClick={() => console.log(data1)}>Check</button> */}
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


