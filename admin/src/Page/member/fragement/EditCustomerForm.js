import { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, Typography, Alert, } from '@mui/material';
import apis from '../../../api';
import { apiResult, formToJson, getUserSession,  } from '../../../Utils/Common';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { GenderSelector } from '../../../Component/MuiEx'
const EditCustomerForm = (props) => {
    const [customer, setCustomer] = useState()
    const [fieldErrors, setFieldErrors] = useState()    
    const [error, setError] = useState()
    getUserSession(apis)
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        props.customerid ? apis.getCustomer(props.customerid).then(ret => {
            apiResult(ret, (data) => {
                if (data.info) {
                    data.info.map(item => {
                        data.member[item['key']] = item['value']
                    })
                }
                setCustomer(data.member)
            }, setError)
        }) : setCustomer({})
    }, [])

    const handleGenderSelect = (value) => {
        setCustomer({ ...customer, gender: value })
    }
    const handleDatePicker = (e) => {
        setCustomer({ ...customer, birthday: e.target.value })
    }
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const postData = formToJson(data)
        postData.gender = customer.gender
        postData.birthday = customer.birthday
        postData.id = customer && customer.id
        postData.email = postData.email === "" ? undefined : postData.email
        postData.phone = postData.phone === "" ? undefined : postData.phone
        apis.editCustomer(postData).then(ret => {
            apiResult(ret, (data) => {
                setCustomer({ ...customer, id: data })
                props.onClose && props.onClose(true)
            }, setError, setFieldErrors)
        })
    };
    return (
        customer && <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography component="h1" variant="h5">Add & Edit Member</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField defaultValue={customer && customer.firstname} name="firstname" required fullWidth id="firstname" label="First Name"
                                error={fieldErrors && fieldErrors.firstname ? true : false}
                                helperText={fieldErrors && fieldErrors.firstname ? fieldErrors.firstname : ''}
                                autoFocus />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth id="lastname" defaultValue={customer && customer.lastname} label="Last Name" name="lastname"
                                error={fieldErrors && fieldErrors.lastname ? true : false}
                                helperText={fieldErrors && fieldErrors.lastname ? fieldErrors.lastname : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth
                                margin="normal" type="date"
                                onChange={handleDatePicker}
                                value={customer && customer.birthday} label="Birthday"
                                InputLabelProps={{ shrink: true }} />
                      
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <GenderSelector onChange={handleGenderSelect} defaultValue={customer && customer.gender}></GenderSelector>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="email" label="Email Address" defaultValue={customer && customer.email} name="email"
                                error={fieldErrors && fieldErrors.email ? true : false}
                                helperText={fieldErrors && fieldErrors.email ? fieldErrors.email : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="phone" label="Mobile Phone" defaultValue={customer && customer.phone} name="phone"
                                error={fieldErrors && fieldErrors.phone ? true : false}
                                helperText={fieldErrors && fieldErrors.phone ? fieldErrors.phone : ''}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField name="address" defaultValue={customer && customer.address} fullWidth id="address" label="No. Street"
                                error={fieldErrors && fieldErrors.address ? true : false}
                                helperText={fieldErrors && fieldErrors.address ? fieldErrors.address : ''} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="city" label="City" name="city" defaultValue={customer && customer.city}
                                error={fieldErrors && fieldErrors.city ? true : false}
                                helperText={fieldErrors && fieldErrors.city ? fieldErrors.city : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="province" label="Province" name="province" defaultValue={customer && customer.province}
                                error={fieldErrors && fieldErrors.province ? true : false}
                                helperText={fieldErrors && fieldErrors.province ? fieldErrors.province : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="country" label="Country" name="country" defaultValue={customer && customer.country}
                                error={fieldErrors && fieldErrors.country ? true : false}
                                helperText={fieldErrors && fieldErrors.country ? fieldErrors.country : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="postcode" label="Zipcode" name="postcode" defaultValue={customer && customer.postcode}
                                error={fieldErrors && fieldErrors.postcode ? true : false}
                                helperText={fieldErrors && fieldErrors.postcode ? fieldErrors.postcode : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField multiline rows={3} id="ext" label="Extend Information" name="ext" fullWidth defaultValue={customer && customer.ext}
                                error={fieldErrors && fieldErrors.ext ? true : false} />
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
export default EditCustomerForm