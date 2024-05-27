import { FC, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { deleteFile, updateFileInfo } from '../../../services/API'

import './FileItem.css'

type FileProps = {
    file: TypeFile
}

/**
 * Компонент для отображения и управления файлом.
 * @component
 * @param {FileProps} props - Свойства компонента.
 * @param {TypeFile} props.file - Объект файла, содержащий информацию о файле.
 * @returns {JSX.Element} Компонент элемента файла.
 */
export const FileItem: FC<FileProps> = ({ file }) => {
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>(file.name)
    const [newComment, setNewComment] = useState<string>(file.comment ? file.comment : '')

    const mutationDelete = useMutation(() => deleteFile(file.id), 
        {
            onSuccess: () => {
                queryClient.invalidateQueries('files')
            },
        })

    const mutationUpdate = useMutation(
        () => updateFileInfo({ fileId: file.id, newName, newComment }), 
        {
            onSuccess: () => {
                queryClient.invalidateQueries('files')
                setIsEditing(false)
            },
        })
    
    /**
     * Обработчик удаления файла.
     */    
    const handleDelete = () => {
        mutationDelete.mutate()
    }

    /**
     * Обработчик начала редактирования файла.
     */
    const handleEdit = () => {
        setIsEditing(true)
    }

    /**
     * Обработчик сохранения изменений файла.
     */
    const handleSaveEdit = () => {
        mutationUpdate.mutate()
    }

    /**
     * Обработчик отмены редактирования файла.
     */
    const handleCancelEdit = () => {
        setIsEditing(false)
        setNewName(file.name)
        setNewComment(file.comment)
    }

    /**
     * Обработчик скачивания файла.
     */
    const handleDownload = () => {
        const downloadUrl = `http://127.0.0.1:8000/api/v1/download/${file.hash}`
        window.open(downloadUrl, '_blank')
    }

    /**
     * Обработчик копирования ссылки на файл.
     */
    const handleCopyLink = () => {
        const downloadUrl = `http://127.0.0.1:8000/api/v1/download/${file.hash}`
        navigator.clipboard.writeText(downloadUrl)
            .then(() => {
                alert('Link copied to clipboard!')
            })
            .catch(() => {
                alert('Failed to copy link.')
            })
    }

    return (
        <li className="file-item">
            {isEditing ? (
                <div className="file-edit">
                <input value={newName} onChange={(e) => setNewName(e.target.value)} />
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <button onClick={handleSaveEdit} disabled={mutationUpdate.isLoading}>
                    {mutationUpdate.isLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button onClick={handleCancelEdit}>Отмена</button>
                </div>
            ) : (
                <div className="file-info">
                <h3>{file.name}</h3>
                <p>Описание: {file.comment}</p>
                <p>Размер: {Number(file.size) / 1000000} MB</p>
                <p>Создан: {new Date(file.data_created * 1000).toLocaleString('ru')}</p>
                <p>Дата скачивания: {file.date_download ? new Date(file.date_download * 1000).toLocaleString('ru') : 'Нет'}</p>
                <div className="file-actions">
                    <button onClick={handleEdit}>Редактировать</button>
                    <button onClick={handleDelete} disabled={mutationDelete.isLoading}>
                    {mutationDelete.isLoading ? 'Удаление...' : 'Удалить'}
                    </button>
                    <button onClick={handleDownload}>Скачать</button>
                    <button onClick={handleCopyLink}>Скопировать ссылку</button>
                </div>
                </div>
            )}
        </li>
    )
}
