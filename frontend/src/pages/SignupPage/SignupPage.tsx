import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'

import './SignupPage.css'
import { useMutation } from "react-query"
import { axiosInstance } from "../../services/API"
import { axiosCheckError } from '../../utils/helperFunctions'

export const SignupPage = () => {
    const navigate = useNavigate()

    const registrationMutation = useMutation(
        (data: TypeFormValuesSignup) => axiosInstance.post('/api/v1/auth/users/', data),
        {
            onSuccess: () => {
                navigate('/login')
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
    } = useForm<TypeFormValuesSignup>({
        mode: "onChange"
    })

    const onSubmit = async (data: TypeFormValuesSignup) => {
        try {
            // reset() ВКЛЮЧИТЬ В ПРОДЕ!!!
            registrationMutation.mutateAsync(data)
            console.log(registrationMutation)
        }
        catch (error) {
            console.error("Registration failed:", error)
        }
    }

    return (
        <>
            <h1>Форма регистрации</h1>
            {registrationMutation.isLoading ? (
                <p>Loading...</p>
            )
            : (
            <form className="signup-form" action="" onSubmit={handleSubmit(onSubmit)}>
                <label className="label">
                    Username:
                    <input className="input" {...register('username', {
                        required: "Обязательное поле!",
                        pattern: 
                        {
                            value: /^[a-zA-Z][a-zA-Z0-9]{3,19}$/g,
                            message: 'Только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов!'
                        }
                    })}/>
                </label>
                <div className="error">{errors?.username && <p>{errors?.username?.message || "Error"}</p>}</div>

                <label className="label">
                    FullName:
                    <input className="input" {...register('fullname', {
                        required: "Обязательное поле!"
                    })}/>
                </label>
                <div className="error">{errors?.fullname && <p>{errors?.fullname?.message || "Error"}</p>}</div>

                <label className="label">
                    Email:
                    <input className="input" {...register('email', {
                        required: "Обязательное поле!",
                        pattern:
                        {
                            value: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/g,
                            message: 'Пример Email Ivanov@yandex.ru'
                        }
                    })}/>
                </label>
                <div className="error">{errors?.email && <p>{errors?.email?.message || "Error"}</p>}</div>

                <label className="label">
                    Password:
                    <input className="input" {...register('password', {
                        required: "Обязательное поле!",
                        pattern: {
                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*\/\\])[a-zA-Z0-9!@#\/$%^&*\\]{6,20}$/,
                            message: 'не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ.'
                        }
                    })}/>
                </label>
                <div className="error">{errors?.password && <p>{errors?.password?.message || "Error"}</p>}</div>

                <input className="submit" type="submit" disabled={!isValid}/>

            </form>
            )
            }
            {registrationMutation.isError && (
                <div className="error-response">
                    <p> { axiosCheckError(registrationMutation) } </p>
                </div>
            )}
        </>
    )
}
