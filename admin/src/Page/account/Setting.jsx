import { useState } from 'react';
import {  Button, TextField, Typography, Alert, Paper, Divider } from '@mui/material';
import apis from '../../api';
import { apiResult, formToJson, getUserSession, sessionSet, setUserSession } from '../../Utils/Common';
import {Title} from '../../Component/MuiEx';
import { useNavigate } from 'react-router';
const AccountSetting = () => {   

    const navigate = useNavigate()
   
    return (
        <Paper sx={{  display: 'flex', flexDirection: 'column',background:'#ffffff',p:3, alignItems: 'left'}}>
            <Title>Account Setting</Title>
            {/* <Typography variant="subtitle1" component="div" sx={{ mt: 3 }} gutterBottom>
                Your Account: <b>{session && session.email}</b>
            </Typography> */}
            <Divider sx={{my:1}}></Divider>
            <Typography variant="body1" component="div" gutterBottom>
                Reset password<Button type="button"  onClick={()=>{navigate('/account/resetpwd')}} variant="outlined" sx={{ mb: 2,ml:10,mt:1,maxWidth:200}}>Reset Password</Button>
            </Typography>
        </Paper>
    );
}
export default AccountSetting