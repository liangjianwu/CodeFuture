import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Avatar } from '@mui/material';
import apis from '../../api';
import { apiResult,  getUserSession, sessionGet,  setUserSession } from '../../Utils/Common';
import { ResendButton } from '../../Component/MuiEx';
import { useNavigate } from 'react-router';
import { Title } from '../../Component/MuiEx';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { LockOutlined } from '@mui/icons-material';

const EmailVerify = () => {
    const [error, setError] = useState()
    const [error1, setError1] = useState()
    const [verified, setVerified] = useState()
    const [code, setCode] = useState()
    const [sended,setSended] = useState(false)
    const navigate = useNavigate()
    const session = getUserSession(apis)
    const handleChange = (event) => {
        setCode(event.target.value)
        setError1()
        setError()
    }
    const handleGetCode = (event) => {
        setError1()
        setError()
        event.preventDefault();

        apis.sendCode({ action: 'register' }).then(ret => {
            apiResult(ret, (data) => {
                setSended(true)
            }, (error) => setError(error))
        })
    };
    const handleVerify = (event) => {
        setError1()
        setError()
        event.preventDefault();

        apis.emailVerify({ code: code, action: 'register' }).then(ret => {
            apiResult(ret, (data) => {
                if (session) {
                    session.email_verified = 1
                    setUserSession(session)
                }
                setVerified(data)
                setTimeout(() => {
                    const url = sessionGet('loginCallback')
                    navigate(url ? url : '/member/kids')
                }, 1000)
            }, (error) => setError1(error))
        })
    };
    const handleResend = (e, callback) => {
        setError1()
        setError()
        apis.sendCode({ action: 'register' }).then(ret => {
            apiResult(ret, (data) => {
                setSended(true)
                callback()
            }, (error) => setError(error))
        })
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column',alignItems: 'center',  }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlined /></Avatar>
                <Typography component="h1" variant="h5"> Verify your email </Typography>
                <Typography variant="subtitle1" component="div" sx={{ mt: 3, mb: 4 }} gutterBottom>
                    Your Email: <b>{session && session.email}</b>
                </Typography>
                <Typography variant="body1" component="div" gutterBottom>
                    Your email has not been verified, click the "Get code" button to get the code to verify your email!
                </Typography>
                <Button type="button" fullWidth disabled={sended ? true : false} onClick={handleGetCode} variant="contained" sx={{ mb: 2, mt: 1, maxWidth: 400 }}>Get Code</Button>
                {error && <Alert severity="error">{error}</Alert>}
                {sended && <>
                    <Alert severity="success" action={<ResendButton size="small" onClick={handleResend} txt1={"Resend"} txt2={"Resend"} disabled={true} count={60}></ResendButton>}>
                        The code has been sent to your email, please check your email box!
                    </Alert>
                    <Typography variant="body1" component="div" gutterBottom sx={{ mt: 3 }}>
                        Input the code that you have got from your email
                    </Typography>
                    <TextField margin="normal" name="code" width="sm" sx={{ maxWidth: 400 }} required fullWidth id="code" onChange={handleChange} label="Code" />
                    {error1 && <Alert severity="error">{error1}</Alert>}
                    {verified && <Alert severity="success">{verified}</Alert>}
                    {!verified && <Button fullWidth type="button" variant="contained" sx={{ mb: 2, mt: 1, maxWidth: 400 }} onClick={handleVerify}>Verify</Button>}
                </>}
            </Box>
        </Container>
    );
}
export default EmailVerify