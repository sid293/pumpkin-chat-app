import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Chat from './components/Chat'
import './components/Auth.css'

function App() {
  const hasUserData = sessionStorage.getItem('userData') !== null

  //routes
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={hasUserData ? <Chat /> : <Navigate to="/signup" />} />
        <Route path="/" element={<Navigate to="/signup" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App