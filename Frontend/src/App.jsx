import { signInWithPopup } from 'firebase/auth'
import React, { useEffect } from 'react'
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'
import Home from './pages/Home'
import getCurrentUser from './features/getCurrent'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/user.slice'

const App = () => {

  const dispatch = useDispatch();

  useEffect (()=>{
    const getUser = async ()=>{
     const data =  await getCurrentUser();
      dispatch(setUserData(data))
    }
    getUser();
  },[]);
  

  return (
   <>
    <Home />
   </>
  )
}

export default App
