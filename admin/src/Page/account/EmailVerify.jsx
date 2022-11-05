import { useState } from 'react';
import {  Button, TextField, Typography, Alert, Paper } from '@mui/material';
import apis from '../../api';
import { apiResult, formToJson, getUserSession, sessionSet, setUserSession } from '../../Utils/Common';
import {ResendButton} from '../../Component/MuiEx';
import { useNavigate } from 'react-router';
import { Title } from '../../Component/MuiEx';
const EmailVerify = () => {    
    const [error, setError] = useState()
    const [error1, setError1] = useState()
    const [verified,setVerified] = useState()
    const [code,setCode] = useState()
    const navigate = useNavigate()
    const session = getUserSession(apis)
    const handleChange = (event)=> {
        setCode(event.target.value)
    }
    const handleGetCode = (event) => {        
        setError()
        event.preventDefault();
       
        apis.sendCode({action:'register'}).then(ret => {
            apiResult(ret, (data) => {                
                setCode(true)
            }, (error) => setError(error))
        })
    };
    const handleVerify = (event) => {        
        setError()
        event.preventDefault();
       
        apis.emailVerify({code:code,action:'register'}).then(ret => {
            apiResult(ret, (data) => {                
                if(session) {
                    session.email_verified = 1
                    setUserSession(session)
                }
                setVerified(data)
                setTimeout(()=>{navigate('/service/merchant/home')},1000)
            }, (error) => setError1(error))
        })
    };
    const handleResend = (e,callback) =>{
        setCode(false)
        apis.sendCode({action:'register'}).then(ret => {
            apiResult(ret, (data) => {                
                setCode(true)
                callback()
            }, (error) => setError(error))
        })
    }
    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column',background:'#ffffff',p:3, alignItems: 'left',minHeight:400}}>
            <Title>Verify your email</Title>
            <Typography variant="subtitle1" component="div" sx={{ mt: 3, mb: 4 }} gutterBottom>
                Your Email: <b>{session&&session.email}</b>
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
                Your email has not been verified, Click the "Get Code" button to get the code to verify your email!
            </Typography>
            <Button type="button" disabled={code?true:false} onClick={handleGetCode} variant="contained" sx={{ mb: 2,mt:1,maxWidth:400}}>Get Code</Button>
            {error && <Alert severity="error">{error}</Alert>}
            {code && <>
            <Alert severity="success" action={<ResendButton size="small" onClick={handleResend} txt1={"Resend"} txt2={"Resend"} disabled={true} count={60}></ResendButton>}>
                The code has been sent your email, please check your email box to get the code
            </Alert>
            <Typography variant="body1" component="div" gutterBottom sx={{mt:3}}>
                Input the code that you have got from your email
            </Typography>
            <TextField margin="normal" name="code" width="sm" sx={{maxWidth:400}} required fullWidth id="code" onChange={handleChange} label="Code"/>
            {error1 && <Alert severity="error">{error}</Alert>}
            {verified && <Alert severity="success">{verified}</Alert>}
            {!verified&&<Button type="button" variant="contained" sx={{ mb: 2,mt:1,maxWidth:400}} onClick={handleVerify}>Verify</Button>}
            </>}
        </Paper>
    );
}
export default EmailVerify