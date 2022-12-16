import { useEffect, useState } from 'react';
import { Button, TextField, FormControl,InputLabel,Select,MenuItem, Grid, Box, Typography, Alert, } from '@mui/material';
import apis from '../../../api';
import { apiResult, formToJson, getUserSession} from '../../../Utils/Common';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { loadAreas } from '../../../Component/DataLoader';

const UserEditForm = (props) => {
    const {user,onClose} = props
    const [fieldErrors, setFieldErrors] = useState()    
    const [error, setError] = useState()
    const [areas,setAreas] = useState()
    const [area_id,setAreaId] = useState(user?.area_id)
    const session = getUserSession(apis)
    useEffect(()=>{
        loadAreas(apis,setAreas,setError)
    },[])
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postData = formToJson(data)
        postData.id = user ? user.id:0
        postData.area_id = area_id
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
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-autowidth-label">Area</InputLabel>
                                <Select labelId="demo-simple-select-autowidth-label"
                                    id="area_id"
                                    onChange={(e) => { setAreaId(e.target.value) }}
                                    label="Select Area"
                                    defaultValue={user?.area_id}
                                >   
                                    <MenuItem value={0}>All</MenuItem>
                                    {areas && areas.map((p, idx) => {
                                        return <MenuItem key={idx} value={p.id}>{p.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
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