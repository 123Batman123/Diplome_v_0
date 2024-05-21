import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/ui/Layout/Layout'
import { MainPage } from './pages/MainPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { SignupPage } from './pages/SignupPage/SignupPage'
import { Admin } from './pages/Admin/Admin'

function App() {

  return (
    <>
      <Routes>
        <Route path='/admin' element={<Admin/>} />
        <Route path='/' element={<Layout/>}>
          
          <Route index element={<MainPage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/signup' element={<SignupPage/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
