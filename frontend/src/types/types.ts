// Тип для формы регистрации
type TypeFormValuesSignup = {
    username: string
    email: string
    password: string
    fullname: string
}

type TypeFormValuesLogin = {
    username: string
    password: string
}

// Основной Тип для файла
type TypeFile = {
    id: number
    name: string
    size: string
    data_created: number
    date_download: number
    comment: string
    hash: string
}