import { useState } from 'react';
import { Accordion,AccordionSummary,AccordionDetails, Button, TextField, Grid, Box, Typography, Alert, TextareaAutosize } from '@mui/material';
import apis from '../../../api';
import { apiResult, formToJson,  } from '../../../Utils/Common';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { GenderSelector } from '../../../Component/MuiEx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const CustomerDetail = (props) => {
    const [customer, setCustomer] = useState(props.customer ? props.customer : {})
    const [fieldErrors, setFieldErrors] = useState()
    const [expanded, setExpanded] = useState('panel1');
    const [error, setError] = useState()
    const handlePanelChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : 'panel1');
      };
    
    const handleGenderSelect = (value) => {
        setCustomer({ ...customer, gender: value })
    }
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        
        const data = new FormData(event.currentTarget);
        const postData = formToJson(data)
        postData.gender = customer.gender        
        postData.id = customer && customer.id
        apis.editCustomer(postData).then(ret => {
            apiResult(ret, (data) => {
               setCustomer({...customer,id:data})
               props.onClose && props.onClose(true)
            }, setError, setFieldErrors)
        })
    };
    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography component="h1" variant="h5">Add & Edit Customer</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Accordion expanded={expanded === 'panel1'} onChange={handlePanelChange('panel1')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Basic information</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>recommended</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                                <Grid item xs={12} sm={12}>
                                    <GenderSelector onChange={handleGenderSelect}></GenderSelector>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth id="email" label="Email Address" name="email" autoComplete="email"
                                        error={fieldErrors && fieldErrors.email ? true : false}
                                        helperText={fieldErrors && fieldErrors.email ? fieldErrors.email : ''}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth id="phone" label="Mobile Phone" name="phone" autoComplete="phone"
                                        error={fieldErrors && fieldErrors.phone ? true : false}
                                        helperText={fieldErrors && fieldErrors.phone ? fieldErrors.phone : ''}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handlePanelChange('panel2')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header" >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Address information</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>if you have</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField autoComplete="address" name="address" fullWidth id="address" label="No. Street"
                                        error={fieldErrors && fieldErrors.address ? true : false}
                                        helperText={fieldErrors && fieldErrors.address ? fieldErrors.address : ''} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth id="city" label="City" name="city" autoComplete="city"
                                        error={fieldErrors && fieldErrors.city ? true : false}
                                        helperText={fieldErrors && fieldErrors.city ? fieldErrors.city : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth id="province" label="Province" name="province" autoComplete="province"
                                        error={fieldErrors && fieldErrors.province ? true : false}
                                        helperText={fieldErrors && fieldErrors.province ? fieldErrors.province : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth id="country" label="Country" name="country" autoComplete="country"
                                        error={fieldErrors && fieldErrors.country ? true : false}
                                        helperText={fieldErrors && fieldErrors.country ? fieldErrors.country : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth id="postcode" label="Zipcode" name="postcode" autoComplete="postcode"
                                        error={fieldErrors && fieldErrors.postcode ? true : false}
                                        helperText={fieldErrors && fieldErrors.postcode ? fieldErrors.postcode : ''}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel3'} onChange={handlePanelChange('panel3')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Extend information</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>You can add any information that defined by youself</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextareaAutosize id="ext" label="Zipcode" name="ext" autoComplete="ext"
                                error={fieldErrors && fieldErrors.ext ? true : false}/>
                        </AccordionDetails>
                    </Accordion>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }} > Submit </Button>
                    <Button type="button" fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={()=>{props.onClose && props.onClose(false)}}> Cancel </Button>
                </Box>
            </Box>
        </Container>
    );
}
export default CustomerDetail