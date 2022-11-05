import { Button, Dialog, Avatar, Box, Grid,TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { SingleSelector } from '../../../Component/MuiEx';
import { apiResult, formToJson, getUserSession } from '../../../Utils/Common';
import apis from '../../../api';
const AddCompanyDialog = (props) => {
    const [selected, setSelected] = useState({})
    const [error, setError] = useState()
    const [fieldErrors, setFieldErrors] = useState()
    const [nameLabel, setNameLabel] = useState()
    const session = getUserSession(apis)

    const handleOnSubmit = (event) => {
        setError()
        setFieldErrors()
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        let postData = formToJson(data)
        postData = { ...postData, ...selected }
        //console.log(postData)
        apis.addCompany(postData).then(ret => {
            apiResult(ret, (data) => {
                props.onSubmit && props.onSubmit(data)
            }, setError, (errs) => {
                errs['name'] && setError(errs['name'])
            })
        })
    }
    const handleSingleSelected = (name, value) => {
        setSelected({ ...selected, [name]: value })
        if (name == 'type') {
            const labels = ['Company name', 'Business name']
            setNameLabel(labels[value])
        }
    }
    const industrys = ['Retail', 'Real Estate', 'Education', 'Insurance', 'Restaurant']
    return (<Dialog open={props.open} onClose={props.onClose}>
        <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',width:500,mb:6 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><AddBusinessIcon /></Avatar>
            <Typography component="h1" variant="h5">Business Information</Typography>
            <Box component="form" onSubmit={handleOnSubmit} sx={{ mt: 3 ,width:400}}>
                <Grid container spacing={2}>                    
                    <Grid item xs={12} sm={12}>
                        <TextField required fullWidth id="name" label={nameLabel} name="name"
                            error={fieldErrors && fieldErrors.name ? true : false}
                            helperText={fieldErrors && fieldErrors.name ? fieldErrors.name : ''}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <SingleSelector name="industry" defaultValue={-1}
                            values={industrys} items={industrys}
                            onChange={handleSingleSelected} />
                    </Grid>
                </Grid>
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3}} > Submit </Button>
                <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={props.onClose}> Cancel </Button>
            </Box>
        </Box>
    </Dialog>)
}
export default AddCompanyDialog