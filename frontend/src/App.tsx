import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/ui/Layout/Layout'
import { MainPage } from './pages/MainPage/MainPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { SignupPage } from './pages/SignupPage/SignupPage'
import { PrivateRoute } from './components/ui/PrivateRoute'
import { UserList } from './components/ui/AdminUserList/AdminUserList'
import { AdminUserFiles } from './components/ui/AdminUserFiles/AdminUserFiles'

/**
 * Главный компонент приложения, который определяет маршрутизацию.
 * @component
 * @returns {JSX.Element} Главный компонент приложения.
 */
const App = () => {

	return (
		<Routes>
			<Route path='/' element={<Layout/>}>
				<Route index element={<MainPage/>} />
				<Route path='/login' element={<LoginPage/>} />
				<Route path='/signup' element={<SignupPage/>} />
				<Route path="/admin/users" element={
					<PrivateRoute>
							<UserList />
					</PrivateRoute>
				} />
				<Route path="/admin/users/:userId/files" element={
					<PrivateRoute>
							<AdminUserFiles />
					</PrivateRoute>
				} />
			</Route>
		</Routes>
	)
}

export default App
