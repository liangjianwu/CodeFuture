import { useState } from 'react';
import { Button, TextField,  Grid, Box, Typography, Alert, } from '@mui/material';
import apis from '../../../api';
import { apiResult, formToJson, getUserSession} from '../../../Utils/Common';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

const UserEditForm = (props) => {
    const {user,onClose} = props
    const [fieldErrors, setFieldErrors] = useState()    
    const [error, setError] = useState()
    const session = getUserSession(apis)

    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postData = formToJson(data)
        postData.id = user ? user.id:0
        apis.editUser(postData).then(ret => {
            apiResult(ret, (data) => {                
                onClose && onClose(true)
            }, setError, setFieldErrors)
        })
    };
    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography component="h1" variant="h5">Add & Edit Family</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField defaultValue={user && user.firstname} name="firstname" required fullWidth id="firstname" label="First Name"
                                error={fieldErrors && fieldErrors.firstname ? true : false}
                                helperText={fieldErrors && fieldErrors.firstname ? fieldErrors.firstname : ''}
                                autoFocus />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth id="lastname" defaultValue={user && user.lastname} label="Last Name" name="lastname"
                                error={fieldErrors && fieldErrors.lastname ? true : false}
                                helperText={fieldErrors && fieldErrors.lastname ? fieldErrors.lastname : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="email" label="Email Address" defaultValue={user && user.email} name="email"
                                error={fieldErrors && fieldErrors.email ? true : false}
                                helperText={fieldErrors && fieldErrors.email ? fieldErrors.email : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="phone" label="Mobile Phone" defaultValue={user && user.phone} name="phone"
                                error={fieldErrors && fieldErrors.phone ? true : false}
                                helperText={fieldErrors && fieldErrors.phone ? fieldErrors.phone : ''}
                            />
                        </Grid>
                    </Grid>

                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }} > Submit </Button>
                    <Button type="button" fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={() => { props.onClose && props.onClose(false) }}> Cancel </Button>
                </Box>
            </Box>
        </Container>
    );
}
export default UserEditForm