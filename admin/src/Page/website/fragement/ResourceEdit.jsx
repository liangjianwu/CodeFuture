import { useState } from 'react';
import { Button, TextField,Skeleton,Backdrop,CircularProgress, Grid, Box, Typography, Alert, } from '@mui/material';
import apis from '../../../api';
import { apiResult, formToJson, getUserSession } from '../../../Utils/Common';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { SingleSelector } from '../../../Component/MuiEx';
import Uploader from '../../../Component/Uploader';
// import Uploady, { useItemFinishListener, useItemErrorListener, useItemStartListener } from "@rpldy/uploady";
// import { asUploadButton } from "@rpldy/upload-button";
const ResourceEdit = (props) => {
    const {onClose,item} = props
    const [resource, setResource] = useState(item) 
    const [fieldErrors, setFieldErrors] = useState()
    const [loading,setLoading] = useState(false)
    const [error, setError] = useState()
    const session = getUserSession(apis)    
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postData = formToJson(data) 
        postData.id = resource.id
        postData.islocal = resource.islocal
        postData.resource_type = resource.resource_type
        postData.type = resource.type
        postData.path = resource.path
        apis.postResource(postData).then(ret => {
            apiResult(ret, (data) => {
                onClose && onClose(data)
            }, setError, setFieldErrors)
        })
    };
    const handleChange = (name,value)=>{
        setResource({...resource,[name]:value})
    }
    // const LogProgress = () => {
    //     useItemFinishListener((res) => {
    //         //console.log(res.uploadResponse.data.data)        
    //         let filename = res.uploadResponse.data.data
    //         setResource({ ...resource, path: filename })
    //         setLoading(false)

    //     })
    //     useItemErrorListener((res) => {
    //         setLoading(false)
    //         setError(res.uploadResponse.data.data.error)
    //     })
    //     useItemStartListener((obj) => {
    //         setError()
    //         setLoading(true)
    //     })
    //     return null;
    // }
    // const DivUploadButton = asUploadButton((props) => {
    //     return <div {...props} style={{ width: 150, height: 35, padding: 6, cursor: "pointer", border: '1px solid grey' }}>
    //         {loading ? <CircularProgress /> : <Typography variant="subtitle2">SELETE A PHOTO</Typography>}
    //     </div>
    // });
    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            {loading && <Backdrop open={loading} ><CircularProgress color="inherit" /></Backdrop>}
            <Box sx={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography component="h1" variant="h5">Add & Edit Reource</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField defaultValue={resource && resource.name} name="name" fullWidth id="name" label="Resource name"
                                error={fieldErrors && fieldErrors.name ? true : false}
                                helperText={fieldErrors && fieldErrors.name ? fieldErrors.name : ''}
                                autoFocus />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField defaultValue={resource && resource.description} multiline rows={3} name="description" fullWidth id="description" label="Resource description"
                                error={fieldErrors && fieldErrors.description ? true : false}
                                helperText={fieldErrors && fieldErrors.description ? fieldErrors.description : ''}
                                autoFocus />
                        </Grid>
                        <Grid item xs={6}>
                            <SingleSelector items={['Upload', 'Url']} values={[1, 0]} name="islocal" defaultValue={resource && resource.islocal >= 0 ? resource.islocal:1} onChange={handleChange}/>
                        </Grid>
                        {resource && resource.islocal == 0 && <Grid item xs={6}>
                            <SingleSelector items={['Photo', 'Video']} values={['img', 'video']} name="resource_type" defaultValue={resource &&resource.resouce_type?resource.resouce_type:'img'}  onChange={handleChange}/>
                        </Grid>}
                        {resource && resource.islocal == 0 && <Grid item xs={12}>
                            <TextField fullWidth id="path" label="Url" defaultValue={resource && resource.path} name="path" onChange={(e)=>{
                                handleChange('path',e.target.value)
                            }}
                                error={fieldErrors && fieldErrors.path ? true : false}
                                helperText={fieldErrors && fieldErrors.path ? fieldErrors.path : ''}
                            />
                        </Grid>}
                        {resource && resource.islocal == 1 && <Grid item xs={12}>
                            {resource && resource.path ? <img style={{ maxHeight: 150 }} src={"/api/resource/photo?file=" + resource.path}></img>:<Skeleton variant="rectangular" sx={{mb:2}} width={200} height={140} />}
                            {/* <Uploady
                                destination={apis.uploadResource(getUserSession())}>
                                <LogProgress />
                                <DivUploadButton />
                            </Uploady> */}
                            <Uploader onUpload={(filename)=>setResource({ ...resource, path: filename })} onFailed={setError} />
                        </Grid>}
                    </Grid>

                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }} > Submit </Button>
                    <Button type="button" fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={() => { onClose && onClose(false) }}> Cancel </Button>
                </Box>
            </Box>
        </Container>
    );
}
export default ResourceEdit