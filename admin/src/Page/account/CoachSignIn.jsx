import {useState} from 'react';
import {Avatar,Alert} from '@mui/material';
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
import CopyRight from '../../Component/CopyRight'
import apis from '../../api';
import { apiResult,formToJson, setCoachSession } from '../../Utils/Common';
import { PasswordTextField } from '../../Component/MuiEx';
export default function CoachSignIn() {
  const [fieldErrors, setFieldErrors] = useState()
  const [error,setError] = useState()
  const [rememberMe,setChecked] = useState(false)
  const handleChecked = (event) => {
    setChecked(event.target.checked)
  }
  const handleSubmit = (event) => {
    setFieldErrors()
    setError()
    event.preventDefault();
    
    const data = new FormData(event.currentTarget);
    apis.coachSignIn(formToJson(data)).then(ret => {
      apiResult(ret, (data) => {
        setCoachSession(data,rememberMe)
        window.location.href  = '/schedule/'+data.userid+'/0'
      }, setError, setFieldErrors) })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
        <Typography component="h1" variant="h5"> Coach sign in </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" type="email" name="email" required fullWidth id="email" label="Email Address" autoFocus />
          <PasswordTextField sx={{width:'100%',marginTop:2,marginBottom:2}} required fullWidth name="passwd" label="Password" id="passwd" />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" onChange={handleChecked}/>}
            label="Remember me"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Sign In </Button>          
        </Box>
      </Box>
      <CopyRight sx={{ mt: 5 }} />
    </Container>
  );
}
