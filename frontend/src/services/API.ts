import axios, { AxiosInstance } from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL

/**
 * Экземпляр Axios для взаимодействия с сервером.
 */
export const axiosInstance: AxiosInstance = axios.create({
	baseURL: baseUrl,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
})

/**
 * Устанавливает токен аутентификации в заголовке запросов.
 * @param token Токен для аутентификации.
 */
const setAuthToken = (token: string | null) => {
	if (token) {
		axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`
	} else {
		delete axiosInstance.defaults.headers.common['Authorization']
	}
}

/**
 * Получает список пользователей с сервера.
 * @returns Промис, который разрешается массивом объектов TypeUser.
 */
export const fetchUsers = async (): Promise<TypeUser[]> => {
	setAuthToken(localStorage.getItem('token'))
	const { data } = await axiosInstance.get('/api/v1/admin/users/')
	return data
}

/**
 * Удаляет пользователя с указанным идентификатором.
 * @param userId Идентификатор пользователя.
 * @returns Промис без возвращаемого значения.
 */
export const deleteUser = async (userId: number): Promise<void> => {
	await axiosInstance.delete(`/api/v1/admin/users/${userId}/`)
}

/**
 * Меняет статус администратора для пользователя с указанным идентификатором.
 * @param userId Идентификатор пользователя.
 * @returns Промис без возвращаемого значения.
 */
export const toggleAdminStatus = async (userId: number): Promise<void> => {
	await axiosInstance.patch(`/api/v1/admin/users/${userId}/`)
}

/**
 * Получает список файлов для определенного пользователя.
 * @param userId Идентификатор пользователя.
 * @returns Промис, который разрешается массивом объектов TypeFile.
 */
export const fetchUserFiles = async (userId: string | undefined | number): Promise<TypeFile[]> => {
	const { data } = await axiosInstance.get(`/api/v1/admin/users/${userId}/files/`)
	return data
}

/**
 * При выходе пользователя оправляет на сервер команду для сброса token пользователя для Djoser.
 * @returns Промис без возвращаемого значения.
 */
export const getLogout = async (): Promise<void> => {
	setAuthToken(localStorage.getItem('token'))
	await axiosInstance.post('/auth/token/logout/')
}

/**
 * Получает список файлов с сервера.
 * @returns Промис, который разрешается объектом TypeAnswerFileList.
 */
export const getFiles = async (): Promise<TypeAnswerFileList> => {
	setAuthToken(localStorage.getItem('token'))
	const response = await axiosInstance.get('/api/v1/filelist/')
	return response.data
}

/**
 * Загружает файл на сервер.
 * @param file Файл для загрузки.
 * @param comment Комментарий пользователя, если он есть.
 * @returns Промис без возвращаемого значения.
 */
export const uploadFile = async ({file, comment}: UploadFileWithCommentData): Promise<void> => {
	setAuthToken(localStorage.getItem('token'))
	const formData = new FormData()
	formData.append('file', file)
	formData.append('comment', comment)

	const response = await axiosInstance.post('/api/v1/filelist/', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})

	return response.data
}

/**
 * Удаляет файл с указанным идентификатором с сервера.
 * @param fileId Идентификатор файла.
 * @returns Промис без возвращаемого значения.
 */
export const deleteFile = async (fileId: number): Promise<void> => {
	const response = await axiosInstance.delete(`/api/v1/filedelete/${fileId}/`)
	return response.data
}

/**
 * Обновляет информацию о файле на сервере.
 * @param fileId Идентификатор файла.
 * @param newName Новое имя файла.
 * @param newComment Новый комментарий к файлу.
 * @returns Промис, который разрешается обновленным объектом TypeFile.
 */
export const updateFileInfo = async ({ fileId, newName, newComment }: { fileId: number, newName: string, newComment: string }) : Promise<TypeFile> => {
	const response = await axiosInstance.patch(`/api/v1/filelist/${fileId}/`, { name: newName, comment: newComment })
	return response.data
}