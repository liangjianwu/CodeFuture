import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Home from '../home/Home';
import Event from '../event/Event';
import './index.css'
import Layout from '../Component/Layout';
import SignUp from '../user/SignUp'
import {LoginRoute} from './AuthRoute'
import ResetPwd from '../user/ResetPwd'
import Terms from '../user/Terms'
import EmailVerify from '../user/EmailVerify';
import HomeLayout from '../home/HomeLayout';
import Lottery from '../event/Lottery';
const App = () => {
  const theme = createTheme();  
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>          
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Navigate to="/home/index"/>} />
          <Route path="/home" element={<HomeLayout />} >
            <Route path="index" element={<Home />} />
            <Route path="about" element={<Aboutus />} />
            <Route path="events" element={<Events />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="gallery" element={<Gallery />} />            
            <Route path="qa" element={<Qa />} />
          </Route>
          <Route path="/coach/:name" element={<Coach />} /> */}
          <Route path="/user" element={<Layout />}>
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<LoginRoute/>} />
            <Route path="resetpwd" element={<ResetPwd />} />
            <Route path="terms" element={<Terms />} />
            <Route path="emailverify" element={<EmailVerify />} />
          </Route>          
          <Route path="/event/:code" element={<Event />} /> 
          <Route path="/lottery/:code" element={<Lottery />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
