import axios, { AxiosResponse } from "axios";
import { UseMutationResult } from "react-query";

// Функция для обработки ошибки полученной от сервера
export const axiosCheckError = (mutation: UseMutationResult<AxiosResponse<any, any>, unknown, TypeFormValuesSignup, unknown> | UseMutationResult<AxiosResponse<any, any>, unknown, TypeFormValuesLogin, unknown>) => {
    if (axios.isAxiosError(mutation.error)) {
        return Object.values(mutation.error.response?.data).join("\n ");
    }
    return 'Что-то пошло не так'
}