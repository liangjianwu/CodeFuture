import {useState} from 'react';
import {Avatar,Alert,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
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
import { apiResult,formToJson,sessionSet, setUserSession } from '../../../Utils/Common';
import apis from '../../../api';
import { PasswordTextField } from '../../../Component/MuiEx';

const EditCoach = (props) => {
    const [fieldErrors, setFieldErrors] = useState()
    const [error, setError] = useState()    
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();        
        const data = new FormData(event.currentTarget);
        const postdata = formToJson(data)        
        postdata.id = props.coach ? props.coach.id:0
        apis.editCoach(postdata).then(ret => {
            apiResult(ret, (data) => {  
                postdata.id = data              
                props.onAfterEdit && props.onAfterEdit(postdata)
            }, setError, setFieldErrors)
        }).catch(e=>setError(e.message))
    }
    return <><Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
            <Typography component="h1" variant="h5"> Add or Edit Coach </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField margin="normal" type="text" name="name" defaultValue={props.coach&&props.coach.name} required fullWidth id="name" label="Coach name" 
                error={fieldErrors && fieldErrors.name ? true : false}
                helperText={fieldErrors && fieldErrors?.name}
                autoFocus />
                <TextField  margin="normal" type="text"  defaultValue={props.coach&&props.coach.email} name="email" fullWidth id="email" label="Email" 
                error={fieldErrors && fieldErrors.email ? true : false}
                helperText={fieldErrors && fieldErrors?.email}/>
                <TextField margin="normal" type="decimal" name="phone" fullWidth id="phone" label="Phone"  defaultValue={props.coach&&props.coach.phone}
                error={fieldErrors && fieldErrors.phone ? true : false}
                helperText={fieldErrors && fieldErrors?.phone}/>
                <PasswordTextField sx={{width:'100%',marginTop:2,marginBottom:2}} type="password" name="passwd" fullWidth id="passwd" label="Coach passwd"  error={fieldErrors && fieldErrors.passwd ? true : false}
                helperText={fieldErrors && fieldErrors?.passwd}/>
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Submit </Button>
                <Button type="button" fullWidth variant="outlined" onClick={()=>{props.onClose && props.onClose(false) }} sx={{ mt: 1, mb: 2 }} > Cancel </Button>
            </Box>
        </Box>
    </Container></>
}

export default EditCoach