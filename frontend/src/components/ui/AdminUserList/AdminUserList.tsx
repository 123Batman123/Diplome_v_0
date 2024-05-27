import { FC } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { deleteUser, fetchUsers, toggleAdminStatus } from '../../../services/API'
import './AdminUserList.css'

/**
 * Компонент для отображения списка пользователей и управления ими.
 * @component
 * @returns {JSX.Element} Компонент списка пользователей.
 */
export const UserList: FC = () => {
    const queryClient = useQueryClient()
    const { data: users, error, isLoading } = useQuery('users', fetchUsers)
    const navigate = useNavigate()

    const mutationDelete = useMutation(deleteUser, {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
        },
    })

    const mutationToggleAdmin = useMutation(toggleAdminStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
        },
    })

    if (isLoading) return <div>Loading...</div>
    if (error instanceof Error) return <div>Произошла ошибка: {error.message}</div>

    return (
        <div className="table-container">
            <h1>Список пользователей</h1>
            <table className="excel-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ник</th>
                        <th>Email</th>
                        <th>Имя</th>
                        <th>Admin</th>
                        <th>Количество файлов</th>
                        <th>Размер хранилища</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map(user => (
                        <tr key={user.id} onClick={() => navigate(`/admin/users/${user.id}/files/`)}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.first_name}</td>
                            <td>{user.is_staff ? 'Да' : 'Нет'}</td>
                            <td>{user.total_files}</td>
                            <td>{(user.total_size / 100000).toFixed(2)} MB</td>
                            <td className='button-conteiner'>
                                <button className={user.is_staff ? 'yellow' : ''} onClick={(e) => {e.stopPropagation(); mutationToggleAdmin.mutate(user.id)} }>
                                    {user.is_staff ? 'Снять' : 'Назначить'}
                                </button>
                                <button className="red" onClick={(e) => { e.stopPropagation(); mutationDelete.mutate(user.id) }}>
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}