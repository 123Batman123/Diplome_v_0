import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { deleteUser, fetchUsers, toggleAdminStatus } from '../../../services/API'
import './AdminUserList.css'

export const UserList: React.FC = () => {
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
                            <td>{user.is_superuser ? 'Да' : 'Нет'}</td>
                            <td>{user.total_files}</td>
                            <td>{(user.total_size / 100000).toFixed(2)} MB</td>
                            <td className='button-conteiner'>
                                <button className={user.is_superuser ? 'yellow' : ''} onClick={(e) => {e.stopPropagation(); mutationToggleAdmin.mutate(user.id)} }>
                                    {user.is_superuser ? 'Снять' : 'Назначить'}
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
        // <div>
        //     <h1>Все пользователи</h1>
        //     <ul className='admin-user-list'>
        //         {users?.map(user => (
        //             <li className='user-item' key={user.id}>
        //                 <p>Ник: {user.username}</p>
        //                 <p>Email: {user.email}</p>
        //                 <p>Имя: {user.first_name}</p>
        //                 <p>Количество файлов: {user.total_files}</p>
        //                 <p>Размер хранилища: {user.total_size/1000000} Mb</p>
        //                 <p>Админ: {user.is_superuser? 'Да' : 'Нет'}</p>
        //                 <Link to={`/admin/users/${user.id}/files`}>Посмотреть файлы</Link>
        //                 <button onClick={() => mutationDelete.mutate(user.id)}>Удалить пользователя</button>
        //                 <button onClick={() => mutationToggleAdmin.mutate(user.id)}>
        //                     {user.is_superuser ? 'Снять Admin' : 'Сделать Admin'}
        //                 </button>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
    )
}