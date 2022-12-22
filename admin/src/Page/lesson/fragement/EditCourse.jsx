import { useState } from 'react';
import { Button, TextField,  Grid, Box, Typography, Alert, } from '@mui/material';
import {  formToJson} from '../../../Utils/Common';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

const EditCourse = (props) => {
    const {data,onSubmit,onClose} = props
    const [fieldErrors, setFieldErrors] = useState()    
    const [error, setError] = useState()
    // const session = getUserSession(apis)

    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const postData = formToJson(form)
        postData.id = data ? data.id:0
        //postData.passwd && postData.passwd.length>0 && (postData.passwd = hex_md5(postData.passwd))
        onSubmit && onSubmit(postData,setError,setFieldErrors)
    };
    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography component="h1" variant="h5">Add & Edit Course</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField defaultValue={data?.name} name="name" required fullWidth id="name" label="Course name"
                                error={fieldErrors && fieldErrors.name ? true : false}
                                helperText={fieldErrors && fieldErrors.name ? fieldErrors.name : ''}
                                autoFocus />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField defaultValue={decodeURIComponent(data?.description)} multiline rows={8} name="description" fullWidth id="description" label="Course description"
                                error={fieldErrors && fieldErrors.description ? true : false}
                                helperText={fieldErrors && fieldErrors.description ? fieldErrors.description : ''}
                                />
                        </Grid>     
                        <Grid item xs={12} sm={12}>
                            <TextField type='number' defaultValue={data?.lessonhours} name="lessonhours" fullWidth id="lessonhours" label="The amount of lessons in the course"
                                error={fieldErrors && fieldErrors.lessonhours ? true : false}
                                helperText={fieldErrors && fieldErrors.lessonhours ? fieldErrors.lessonhours : ''}
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
export default EditCourse