import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignUp from '../Page/account/SignUp';
import Layout from '../Page/Layout';
import EmailVerify from '../Page/account/EmailVerify';
import { LoginRoute } from './AuthRoute';
import Home from '../Page/dashboard/Home';
import ResetPwd from '../Page/account/ResetPwd';
import UserProfile from '../Page/account/Profile';
import AccountSetting from '../Page/account/Setting';
import MerchantProfile from '../Page/merchant/Profile';
import MerchantAccounts from '../Page/merchant/Accounts';
import MerchantHome from '../Page/merchant/Home';
import MyCustomer from '../Page/customer/MyCustomer';
import CrmLayout from '../Page/customer/Layout'
import AccountingLayout from '../Page/accounting/Layout'
import Members from '../Page/accounting/Members';
import Products from '../Page/accounting/Products';
import Transactions from '../Page/accounting/Transactions';
import Templates from '../Page/email/Templates';
import Template from '../Page/email/Template';
import Tasks from '../Page/email/Tasks';
import Event from '../Page/event/Event'
import Events from '../Page/event/Events'
import EventLayout from '../Page/event/Layout'
import EmailLayout from '../Page/email/Layout'
import EventPreview from '../Page/event/EventPreview';
import BatCharge from '../Page/accounting/BatCharge';
import Task from '../Page/email/Task';
import TaskResult from '../Page/email/TaskResult';
import Applicant from '../Page/event/Applicant';
const App = () => {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginRoute path="signin" />} />
          <Route path="/account">
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<LoginRoute path="signin" />} />
            <Route path="resetpwd" element={<ResetPwd />} />
          </Route>
          <Route path="/service" element={<Layout />}>
            <Route path="dashboard" element={<Home />} ></Route>
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
          <Route path="/crm" element={<CrmLayout />}>
            <Route path="mycustomer" element={<MyCustomer />} />             
            <Route path="dashboard" element={<MyCustomer />} />             
          </Route>
          <Route path="/email" element={<EmailLayout />}>
            <Route path="mycustomers" element={<MyCustomer />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="task/:id" element={<Task />} />
            <Route path="templates" element={<Templates />} />
            <Route path="template/:id" element={<Template />} />        
            <Route path="taskresult/:id" element={<TaskResult />} />
          </Route>
          <Route path="/accounting" element={<AccountingLayout />}>
            <Route path="dashboard" element={<Members />} />
            <Route path="members" element={<Members />} />
            <Route path="transactions/:id" element={<Transactions />} />
            <Route path="products" element={<Products />} />
            <Route path='quickcharge' element={<BatCharge />} />
          </Route> 
          <Route path="/event" element={<EventLayout />}>
            <Route path="dashboard" element={<Events />} />
            <Route path="events" element={<Events />} />
            <Route path="event/:id" element={<Event />} />                          
            <Route path="applicant/:id" element={<Applicant />} />  
          </Route> 
          <Route path="/event/preview/:id" element={<EventPreview />} />          
          <Route path="/activity/:id" element={<EventPreview />} />   
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
