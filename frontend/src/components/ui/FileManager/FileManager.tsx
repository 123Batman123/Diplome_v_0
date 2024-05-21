import { useMutation, useQuery, useQueryClient } from "react-query"
import { FC, useRef, useState } from "react"
import { getFiles, uploadFile } from "../../../services/API"
import { FileItem } from "../FileItem/FileItem"

import './FileManager.css'

export const FileManager: FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    
    const queryClient = useQueryClient()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const { data: files, error, isLoading } = useQuery('files', getFiles)

    const mutationUpload = useMutation(uploadFile, {
        onSuccess: () => {
            queryClient.invalidateQueries('files')
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        },
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setSelectedFile(event.target.files[0])
        }
    }

    const handleUpload = () => {
        if (selectedFile) {
            mutationUpload.mutate(selectedFile)
        }
    }

    if (isLoading) return <div>Загрузка...</div>
    if (error) {
        if (error instanceof Error) {
            return <div>Произошла ошибка: {error.message}</div>
        }
        else {
            return <div>Произошла неизвестная ошибка!</div>
        } 
    }

    console.log('files', files, 'error', error, 'isLoading', isLoading)

    return (
        <div className="file-manager">
            <h1>File Manager</h1>
            <input type="file" onChange={handleFileChange} ref={fileInputRef} />
            <button onClick={handleUpload} disabled={mutationUpload.isLoading}>
                {mutationUpload.isLoading ? 'Загрузка...' : 'Загрузить файл'}
            </button>
            <ul className="file-list">
                {files && files.files.map((file: TypeFile) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </ul>
        </div>
    )
}

{/* <li key={file.id}>
    <div>
        {file.name}
        <button>delete</button>
    </div>
</li> */}