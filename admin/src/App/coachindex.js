import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignUp from '../Page/account/SignUp';
import Layout from '../Page/Layout';
import EmailVerify from '../Page/account/EmailVerify';
import { LoginRoute } from './AuthRoute';
import ResetPwd from '../Page/account/ResetPwd';
import UserProfile from '../Page/account/Profile';
import AccountSetting from '../Page/account/Setting';
import CoachReport from '../Page/coach/Report';
import Schedule from '../Page/coach/Schedule';
import Dashboard from '../Page/dashboard/Home';
const CoachApp = () => {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/coachview" element={<LoginRoute path="signin" />} />
          <Route path="/coachview/account">
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<LoginRoute path="signin" />} />
            <Route path="resetpwd" element={<ResetPwd />} />
          </Route>
          <Route path="/coachview/service" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} ></Route>
            <Route path="user" >
              <Route path="profile" element={<UserProfile />} />
              <Route path="emailverify" element={<EmailVerify />} />
              <Route path="setting" element={<AccountSetting />} />
            </Route>            
          </Route>    
          <Route path="/coachview/coach" element={<Layout />}>
            <Route path="schedule/:coachid/:memberid" element={<Schedule />}/>
          </Route> 
          <Route path="/coachview/report" element={<Layout />}>
            <Route path="coaches" element={<CoachReport />} />
          </Route> 
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default CoachApp;
