import {useState} from 'react';
import {Avatar,Button,TextField,FormControlLabel,Checkbox,Link,Grid,Box,Typography,Alert} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import apis from '../../api';
import { apiResult, formToJson,sessionSet, setUserSession } from '../../Utils/Common';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CopyRight from '../../Component/CopyRight'
import { PasswordTextField } from '../../Component/MuiEx';
const SignUp = () => {
  const [fieldErrors, setFieldErrors] = useState()
  const [error,setError] = useState()
  const [acceptTerms,setChecked] = useState(false)
  const handleChecked = (event) => {
    setChecked(event.target.checked)
  }
  const handleSubmit = (event) => {
    setFieldErrors()
    setError()
    event.preventDefault();
    if(!acceptTerms) {
      setError('Accept the terms & conditions to sign up!')
      return
    }
    const data = new FormData(event.currentTarget);
    apis.signUp(formToJson(data)).then(ret => {
      apiResult(ret, (data) => {
        setUserSession(data)
        window.location.href  = '/service/dashboard'
      }, (error) => setError(error), (errors) => setFieldErrors(errors)) })
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
      <Typography component="h1" variant="h5">Sign up</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField autoComplete="given-name" name="firstname" required fullWidth id="firstname" label="First Name"
              error={fieldErrors && fieldErrors.firstname ? true : false}
              helperText={fieldErrors && fieldErrors.firstname ? fieldErrors.firstname : ''}
              autoFocus />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required fullWidth id="lastName" label="Last Name" name="lastname" autoComplete="family-name"
              error={fieldErrors && fieldErrors.lastname ? true : false}
              helperText={fieldErrors && fieldErrors.lastname ? fieldErrors.lastname : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email"
              error={fieldErrors && fieldErrors.email ? true : false}
              helperText={fieldErrors && fieldErrors.email ? fieldErrors.email : ''}
            />
          </Grid>
          <Grid item xs={12}>
          <PasswordTextField sx={{width:'100%'}} required fullWidth name="passwd" label="Password" id="passwd" 
              error={fieldErrors && fieldErrors.passwd ? true : false}
              helperText={fieldErrors && fieldErrors.passwd ? fieldErrors.passwd : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" onChange={handleChecked}/>}
              label="I accept all terms & conditions" />
          </Grid>
        </Grid>
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Sign Up </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/account/signin" variant="body2"> Already have an account? Sign in </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
    <CopyRight sx={{ mt: 5 }} />
    </Container>
  );
}
export default SignUp