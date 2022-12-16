import { useState } from 'react';
import { Button, TextField,  Grid, Box, Typography, Alert, } from '@mui/material';
import {  formToJson} from '../../../Utils/Common';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { MultiSelector, SingleSelector } from '../../../Component/MuiEx';

const EditMenu = (props) => {
    const {data,onSubmit,onClose} = props
    const [fieldErrors, setFieldErrors] = useState()    
    const [error, setError] = useState()
    const [type,setType] = useState(data.type?data.type:0)
    const [method,setMethod] = useState(data.method?data.method:'0000')
    // const session = getUserSession(apis)

    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const postData = formToJson(form)
        postData.id = data ? data.id:0
        postData.method = method
        postData.type = type
        //postData.passwd && postData.passwd.length>0 && (postData.passwd = hex_md5(postData.passwd))
        onSubmit && onSubmit(postData,setError,setFieldErrors)
    };
    const methodToOptions = (v)=>{
        let ret = []
        for(let i=0;i<v.length;i++) {
            if(v.substring(i,i+1) == 1) {
                ret.push(i)
            }
        }
        return ret
    }
    const optionsToMethod = (v) => {
        let s = ''
        for(let i=0;i<4;i++) {
            s = s + (v.indexOf(i)>=0? '1':'0');
        }
        setMethod(s)
    }
    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography component="h1" variant="h5">Add & Edit Role</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField defaultValue={data?.name} name="name" required fullWidth id="name" label="Name"
                                error={fieldErrors && fieldErrors.name ? true : false}
                                helperText={fieldErrors && fieldErrors.name ? fieldErrors.name : ''}
                                autoFocus />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField defaultValue={data?.description} name="description" fullWidth id="description" label="description"
                                error={fieldErrors && fieldErrors.description ? true : false}
                                helperText={fieldErrors && fieldErrors.description ? fieldErrors.description : ''}
                                autoFocus />
                        </Grid>      
                        <Grid item xs={12} sm={12}>
                            <TextField defaultValue={data?.url} name="url" required fullWidth id="url" label="url"
                                error={fieldErrors && fieldErrors.url ? true : false}
                                helperText={fieldErrors && fieldErrors.url ? fieldErrors.url : ''}
                                autoFocus />
                        </Grid>    
                        <Grid item xs={12} sm={12}>
                            <SingleSelector items={['Api','Menu']} values={[1,0]} defaultValue={type} name="type" onChange={(name,value)=>{
                                setType(value)
                            }}/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                        <TextField type="number" defaultValue={data.parent_id>0?data.parent_id:0} name="parent_id" fullWidth id="parent_id" label="Parent Id"
                                error={fieldErrors && fieldErrors.parent_id ? true : false}
                                helperText={fieldErrors && fieldErrors.parent_id ? fieldErrors.url : ''}
                                autoFocus />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <MultiSelector items={['POST','GET','DELETE','PUT']} values={[0,1,2,3]} defaultValue={methodToOptions(method)} name="method" onChange={(name,value)=>{
                                optionsToMethod(value)
                            }}/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField defaultValue={data.position>0?data.position:0} type="number" name="position"  fullWidth id="position" label="Position"
                                error={fieldErrors && fieldErrors.position ? true : false}
                                helperText={fieldErrors && fieldErrors.position ? fieldErrors.position : ''}
                                autoFocus />
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
export default EditMenu