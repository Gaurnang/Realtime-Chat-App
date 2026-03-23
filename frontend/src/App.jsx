import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignUpPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'


function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if(isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='animate-spin' size={48} />
      </div>
    )
  }
    
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  )
}

export default App