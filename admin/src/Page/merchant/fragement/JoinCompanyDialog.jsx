import { Button, Dialog, Avatar, Box, Grid,TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { SingleSelector } from '../../../Component/MuiEx';
import { apiResult, formToJson, getUserSession } from '../../../Utils/Common';
import apis from '../../../api';
const JoinCompanyDialog = (props) => {
    const [error, setError] = useState()
    const [fieldErrors, setFieldErrors] = useState()
    const session = getUserSession(apis)

    const handleOnSubmit = (event) => {
        setError()
        setFieldErrors()
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        let postData = formToJson(data)
        //console.log(postData)
        apis.joinCompany(postData).then(ret => {
            apiResult(ret, (data) => {
                props.onSubmit && props.onSubmit(data)
            }, setError, (errs) => {
                errs['token'] && setError(errs['token'])
            })
        })
    }

    return (<Dialog open={props.open} onClose={props.onClose}>
        <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',width:500,mb:6 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><AddBusinessIcon /></Avatar>
            <Typography component="h1" variant="h5">Join the company</Typography>
            <Box component="form" onSubmit={handleOnSubmit} sx={{ mt: 3 ,width:400}}>
                <Grid container spacing={2}>                    
                    <Grid item xs={12} sm={12}>
                        <TextField required fullWidth id="token" label={"Password"} name="token"
                            error={fieldErrors && fieldErrors.token ? true : false}
                            helperText={fieldErrors && fieldErrors.token ? fieldErrors.token : ''}
                        />
                    </Grid>                    
                </Grid>
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3}} > Submit </Button>
                <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={props.onClose}> Cancel </Button>
            </Box>
        </Box>
    </Dialog>)
}
export default JoinCompanyDialog