import { useState } from 'react';
import { Avatar, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import apis from '../api';
import { apiResult, formToJson, getUserSession, sessionGet, setUserSession } from '../Utils/Common';
import { useNavigate } from 'react-router';
import { PasswordTextField } from '../Component/MuiEx';

export default function SignIn() {
  const [fieldErrors, setFieldErrors] = useState()
  const [error, setError] = useState()
  const [rememberMe, setChecked] = useState(false)
  const navigate = useNavigate()
  const session = getUserSession(apis)
  const handleChecked = (event) => {
    setChecked(event.target.checked)
  }
  const handleSubmit = (event) => {
    setFieldErrors()
    setError()
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const postdata = formToJson(data)
    postdata.email = postdata.email.trim()
    apis.signIn(postdata).then(ret => {
      apiResult(ret, (data) => {
        setUserSession(data, rememberMe)
        if (data.email_verified == 0) {
          navigate('/user/emailverify')
          return
        }
        let url = sessionGet('loginCallback')
        navigate(url ? url : '/member/home')
      }, setError, setFieldErrors)
    })
  }

  return (<>
    <Container component="main" maxWidth="xs" sx={{ marginTop: 10 }}>
      <CssBaseline />
      <Box sx={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
        <Typography component="h1" variant="h5"> Sign in </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal"  name="email" required fullWidth id="email" label="Email Address" autoFocus error={fieldErrors && fieldErrors.email ? true : false}
              helperText={fieldErrors && fieldErrors.email ? fieldErrors.email : ''}/>
          <PasswordTextField sx={{width:'100%',marginTop:2,marginBottom:2}} required fullWidth name="passwd" label="Password" type="password" id="passwd" autoComplete="new-password" />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" onChange={handleChecked} />}
            label="Remember me"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Sign In </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" onClick={()=>navigate('/user/resetpwd')} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" onClick={()=>navigate('/user/signup')} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>

      </Box>
    </Container>
  </>
  );
}
