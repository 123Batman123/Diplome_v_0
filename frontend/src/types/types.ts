/**
 * Тип данных для формы регистрации нового пользователя.
 */
type TypeFormValuesSignup = {
    username: string
    email: string
    password: string
    fullname: string
}

/**
 * Тип данных для формы входа пользователя.
 */
type TypeFormValuesLogin = {
    username: string
    password: string
}

/**
 * Основной тип данных, описывающий файл.
 */
type TypeFile = {
    id: number
    name: string
    size: string
    data_created: number
    date_download: number
    comment: string
    hash: string
}

/**
 * Тип данных, описывающий пользователя.
 */
type TypeUser = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    is_staff: boolean;
    total_files: number;
    total_size: number;
}

/**
 * Тип данных, описывающий ответ на запрос списка файлов.
 */
type TypeAnswerFileList = {
    isAdmin: string
    files: TypeFile[]
}