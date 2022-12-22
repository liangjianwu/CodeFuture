import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './index.css'
import Layout from '../Component/Layout';
import TeacherLayout from '../page/lesson/Layout'
import SignUp from '../page/user/SignUp'
import {LoginRoute} from './AuthRoute'
import ResetPwd from '../page/user/ResetPwd'
import Terms from '../page/user/Terms'
import EmailVerify from '../page/user/EmailVerify';
import Lesson from '../page/lesson/Lesson';
import { getUserSession } from '../Utils/Common';
const App = () => {
  const theme = createTheme();  
  const session = getUserSession()
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>          
          <Route path="/" element={<Navigate to={session?'/teacher/lesson':'/user/signin'} />} />         
          <Route path="/user" element={<Layout />}>
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<LoginRoute/>} />
            <Route path="resetpwd" element={<ResetPwd />} />
            <Route path="terms" element={<Terms />} />
            <Route path="emailverify" element={<EmailVerify />} />
          </Route> 
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route path="lesson/:id" element={<Lesson />} />            
          </Route> 
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
