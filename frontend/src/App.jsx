import React from 'react'
import Navbar from './components/Navbar'
import {Routes,Route} from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import  {useAuthStore} from "./store/useAuthStore" 
import { useEffect } from 'react'
import {useThemeStore } from "./store/useThemeStore"
import { Navigate } from 'react-router-dom'

import {Loader} from "lucide-react"
import toast from "react-hot-toast"

const App=() => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme}= useThemeStore()

  console.log({onlineUsers});

  useEffect(()=> {
    checkAuth()
  },[checkAuth]);

  console.log({authUser})
 
  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>

      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    <div data-theme={theme}> 
  <Navbar/>
  <Routes>
<Route path='/' element={ authUser ?<HomePage/> : <Navigate to='/login' /> }/>
<Route path='/signup' element={!authUser ?<SignUpPage/> : <Navigate to='/' />}/>
<Route path='/login' element={!authUser ?<LoginPage/> : <Navigate to='/' /> }/>
<Route path='/settings' element={<SettingsPage/>}/>
<Route path='/profile' element={authUser ?<ProfilePage/> : <Navigate to='/login' />}/>

  </Routes>
    </div>
  )
}

export default App;
