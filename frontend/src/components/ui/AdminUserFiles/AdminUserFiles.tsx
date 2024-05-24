import { FC } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { fetchUserFiles } from '../../../services/API'
import { FileItem } from '../FileItem/FileItem'
import './AdminUserFiles.css'

export const AdminUserFiles: FC = () => {
    const { userId } = useParams<{ userId: string }>()
    const { data: files, error, isLoading } = useQuery(['userFiles', userId], () => fetchUserFiles(userId))

    if (isLoading) return <div>Loading...</div>
    if (error instanceof Error) return <div>Произошла ошибка: {error.message}</div>

    return (
        <div className="admin-user-files">
            <h1>Админ Панель Файлы Пользователя с id №{userId}</h1>
            <div className="file-grid">
                {files?.map((file: TypeFile) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </div>
        </div>
    )
}
