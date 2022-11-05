import { useState } from 'react';
import { Avatar, Button, TextField, Grid, Box, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import apis from '../../api';
import { apiResult, formToJson, setUserSession } from '../../Utils/Common';
import {ResendButton} from '../../Component/MuiEx';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CopyRight from '../../Component/CopyRight'
const ResetPwd = () => {
    const [fieldErrors, setFieldErrors] = useState()
    const [error, setError] = useState()
    const [code, setCode] = useState()
    const [email,setEmail] = useState()
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        const data = formToJson(new FormData(event.currentTarget));
        setEmail(data.email)
        console.log(email)
        if (!code) {
            data.action = 'resetpwd'
            apis.sendCode1(data).then(ret => {
                apiResult(ret, (data) => { setCode(data) }, setError, setFieldErrors)
            })
            return
        }
        apis.resetPwd(data).then(ret => {
            apiResult(ret, (data) => {
                setUserSession()
                window.location.href = '/account/signin'
            }, (error) => setError(error), (errors) => setFieldErrors(errors))
        })
    };
    const handleResend = (e, callback) => {
        if(!email) {
            setError('Email can not be empty')
            return
        }
        apis.sendCode1({ email: email, action: 'resetpwd' }).then(ret => {
            apiResult(ret, (data) => {
                setCode(data)
            }, setError, setFieldErrors)
        })
        callback()
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
                <Typography component="h1" variant="h5">Reset your password</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email"
                        error={fieldErrors && fieldErrors.email ? true : false}
                        helperText={fieldErrors && fieldErrors.email ? fieldErrors.email : ''}
                    />
                    {code && <>
                        <Alert severity="success" action={<ResendButton size="small" onClick={handleResend} txt1={"Resend"} txt2={"Resend"} disabled={true} count={60}></ResendButton>}>
                            The code has been sent your email, please check your email box to get the code
                        </Alert>
                        <TextField margin="normal" required fullWidth id="code" label="Email Verifiy-code" name="code"
                            error={fieldErrors && fieldErrors.email ? true : false}
                            helperText={fieldErrors && fieldErrors.email ? fieldErrors.email : ''}
                        />
                        <TextField margin="normal" required fullWidth name="passwd" label="Password" type="password" id="passwd"
                            error={fieldErrors && fieldErrors.passwd ? true : false}
                            helperText={fieldErrors && fieldErrors.passwd ? fieldErrors.passwd : ''}
                        />
                    </>}
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > {code ? 'Submit' : 'Get code'} </Button>
                </Box>
            </Box>
            <CopyRight sx={{ mt: 5 }} />
        </Container>
    );
}
export default ResetPwd