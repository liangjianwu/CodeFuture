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
import MerchantProfile from '../Page/merchant/Profile';
import MerchantAccounts from '../Page/merchant/Accounts';
import MerchantHome from '../Page/merchant/Home';
import Members from '../Page/member/Members';
import MemberSetting from '../Page/member/MemberSetting';
import Accountings from '../Page/accounting/Accountings';
import Products from '../Page/accounting/Products';
import Transactions from '../Page/accounting/Transactions';
import Templates from '../Page/email/Templates';
import Template from '../Page/email/Template';
import Tasks from '../Page/email/Tasks';
import Event from '../Page/event/Event'
import Events from '../Page/event/Events'
import EventPreview from '../Page/event/EventPreview';
import BatCharge from '../Page/accounting/BatCharge';
import Task from '../Page/email/Task';
import TaskResult from '../Page/email/TaskResult';
import Applicant from '../Page/event/Applicant';
import Coaches from '../Page/coach/Coaches';
import Coach from '../Page/coach/Coach';
import CoachReport from '../Page/coach/Report';
import Family from '../Page/member/Family';
import Orders from '../Page/accounting/Orders';
import Balance from '../Page/accounting/Balance';
import AccountingReport from '../Page/accounting/Report';
import BalanceSnapshot from '../Page/accounting/BalanceSnapshot';
import Gallery from '../Page/website/Gallery';
import Schedule from '../Page/coach/Schedule';
import Dashboard from '../Page/dashboard/Home';
import CoachSignIn from '../Page/account/CoachSignIn';
import GroupCharge from '../Page/accounting/GroupCharge';
import UserSetting from '../Page/setting/User';
import RoleSetting from '../Page/setting/Role';
import MenuSetting from '../Page/setting/Menu';
import BalanceSetting from '../Page/setting/Balance';
import AreaSetting from '../Page/setting/Area';
import Course from '../Page/lesson/Course';
import Courses from '../Page/lesson/Courses';
import Lesson from '../Page/lesson/Lesson';
const App = () => {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginRoute path="signin" />} />
          <Route path="/account">
            <Route path="signup" element={<SignUp />} />
            <Route path="coach" element={<CoachSignIn />} />
            <Route path="signin" element={<LoginRoute path="signin" />} />
            <Route path="resetpwd" element={<ResetPwd />} />
          </Route>
          <Route path="/service" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} ></Route>
            <Route path="user" >
              <Route path="profile" element={<UserProfile />} />
              <Route path="emailverify" element={<EmailVerify />} />
              <Route path="setting" element={<AccountSetting />} />
            </Route>
            <Route path="merchant">
              <Route path="home" element={<MerchantHome />} />
              <Route path="profile" element={<MerchantProfile />} />
              <Route path="accounts" element={<MerchantAccounts />} />
            </Route>
          </Route>
          <Route path="/member" element={<Layout />}>
            <Route path="members" element={<Members />} />             
            <Route path="familys" element={<Family />} />             
            <Route path="setting" element={<MemberSetting />} />             
          </Route>
          <Route path="/email" element={<Layout />}>
            <Route path="Memberss" element={<Members />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="task/:id" element={<Task />} />
            <Route path="templates" element={<Templates />} />
            <Route path="template/:id" element={<Template />} />        
            <Route path="taskresult/:id" element={<TaskResult />} />
          </Route>
          <Route path="/accounting" element={<Layout />}>
            <Route path="dashboard" element={<Accountings />} />
            <Route path="mbalance" element={<Accountings />} />
            <Route path="balance" element={<Balance />} />
            <Route path="balancesnapshot" element={<BalanceSnapshot />} />
            <Route path="orders/:id/:kid" element={<Orders />} />
            <Route path="transactions/:id/:kid" element={<Transactions />} />
            <Route path="products" element={<Products />} />
            <Route path='quickcharge' element={<GroupCharge />} />
            <Route path='memberscharge' element={<BatCharge />} />
          </Route> 
          <Route path="/event" element={<Layout />}>
            <Route path="dashboard" element={<Events />} />
            <Route path="events" element={<Events />} />
            <Route path="event/:id" element={<Event />} />                          
            <Route path="applicant/:id" element={<Applicant />} />  
          </Route> 
          <Route path="/website" element={<Layout />}>
            <Route path="gallery" element={<Gallery />} />
          </Route> 
          <Route path="/coach" element={<Layout />}>
            <Route path="coaches" element={<Coaches />} />                            
            <Route path="coach/:id" element={<Coach />} />  
            <Route path="report" element={<CoachReport />} />  
            <Route path="schedule/:coachid/:memberid" element={<Schedule />}/>
          </Route> 
          <Route path="/report" element={<Layout />}>
            <Route path="coaches" element={<CoachReport />} />
            <Route path="recharge" element={<AccountingReport />} />            
          </Route> 
          <Route path="/setting" element={<Layout />}>
            <Route path="user/:roleid" element={<UserSetting />} />
            <Route path="role/:userid" element={<RoleSetting />} />
            <Route path="menu/:roleid" element={<MenuSetting />} />
            <Route path="balance" element={<BalanceSetting />} />
            <Route path="area" element={<AreaSetting />} />
          </Route>
          <Route path="/lesson" element={<Layout />}>
            <Route path="courses" element={<Courses />} />
            <Route path="course/:courseid" element={<Course />} />
            <Route path="lesson/:lessonid" element={<Lesson />} />
          </Route>
          <Route path="/event/preview/:id" element={<EventPreview />} />          
          <Route path="/activity/:id" element={<EventPreview />} />   
          <Route path="/schedule/:coachid/:memberid" element={<Schedule />}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
