import axios, { AxiosResponse } from "axios";
import { UseMutationResult } from "react-query";

/**
 * Обрабатывает ошибку запроса, полученную от сервера, и возвращает сообщение об ошибке.
 *
 * @param {UseMutationResult<AxiosResponse<any, any>, unknown, TypeFormValuesSignup, unknown> | UseMutationResult<AxiosResponse<any, any>, unknown, TypeFormValuesLogin, unknown>} mutation
 *    Объект мутации, содержащий информацию о запросе и его состоянии.
 *    - mutation.error: ошибка, произошедшая во время запроса.
 *
 * @returns {string}
 *    Сообщение об ошибке, полученное от сервера, или стандартное сообщение, если ошибка не является ошибкой Axios.
 */
export const axiosCheckError = (mutation: UseMutationResult<AxiosResponse<any, any>, unknown, TypeFormValuesSignup, unknown> | UseMutationResult<AxiosResponse<any, any>, unknown, TypeFormValuesLogin, unknown>): string => {
    if (axios.isAxiosError(mutation.error)) {
        return Object.values(mutation.error.response?.data).join("\n ");
    }
    return 'Что-то пошло не так'
}