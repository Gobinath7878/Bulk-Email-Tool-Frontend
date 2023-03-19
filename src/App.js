import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Recipients from './pages/Recipients';
import Teacher from './pages/Teacher';
// import SendEmail from './pages/SendEmail';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css'
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import {AuthContext} from './context/AuthContext'
import { useContext } from "react";


const App = () => {
  const { user} = useContext(AuthContext);

  return (
   
    <BrowserRouter>
    <Navigation/>
    <Routes>
      
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      {user ?(<>
      <Route path='/' element={<Home/>}/>
      <Route path='/teachers' element={<Teacher/>}/>
      <Route path='/students' element={<Recipients/>}/>
      </>
      ):(
        <>
      <Route path='/home' element={<Login/>}/>
      <Route path='/teachers' element={<Login/>}/>
      <Route path='/students' element={<Login/>}/>

        </>
      )}
    </Routes>
    </BrowserRouter>
   
    
  )
}

export default App;