import { EditableTextView, GenderSelector,Title } from "../../Component/MuiEx"
import { Box, Snackbar, FormControlLabel, CircularProgress, Grid, TextField, Typography, Alert, Paper, Divider, Backdrop } from '@mui/material';
import { useEffect, useState } from "react";
import { apiResult, getUserSession } from "../../Utils/Common";
import apis from "../../api";
const MerchantProfile = (props) => {
    const [profile, setUserProfile] = useState({})
    const [error, setError] = useState()
    const session = getUserSession(apis)
    const [loading, setLoading] = useState(false)
    const [changeResult,setChanged] = useState()
    useEffect(() => {
        // apis.loadUseProfile().then(ret => {
        //     apiResult(ret, setUserProfile, setError)
        // })
    }, [])
    const handleChange = (k, v) => {  
        // if (profile[k] !== v) {
        //     setLoading(true)
        //     apis.modifyUserProfile({ [k]: v }).then(ret => {
        //         setLoading(false)
        //         apiResult(ret,(data)=>{
        //             setUserProfile({ ...profile, [k]: v })                    
        //             setChanged(ret.data)
        //         },(errmsg)=>{
        //             setChanged(ret.data)
        //         },(errors)=>{
        //             errors[k] && setChanged({success:false,data:errors[k]})
        //         })
                
        //     })
        // }
    }
    return (
        profile ?
            <Paper sx={{ display: 'flex', flexDirection: 'column', background: '#ffffff', p: 3, alignItems: 'left', minHeight: 400 }}>
                <Title>BUSSINESS INFORMATION</Title>
                
                <Typography variant='overline' color="text.secondary"  mt={2} >
                    COMPANY NAME
                </Typography>
                <EditableTextView defaultValue={profile.phone} name="phone" placeholder={'Your phone number'} onSubmit={(e) => { handleChange('phone', e.target.value) }}></EditableTextView>
                <Divider sx={{ my: 1 }}></Divider>
                <Typography variant='overline' color="text.secondary"  mt={2} >
                    DESCRIPTION OF YOUR BUSSINESS
                </Typography>
                <EditableTextView defaultValue={profile.phone} name="description" placeholder={'Description of your bussiness'} onSubmit={(e) => { handleChange('description', e.target.value) }}></EditableTextView>
                <Divider sx={{ my: 1 }}></Divider>
                <Typography variant='overline' color="text.secondary"  >
                    CONTACT INFORMATION
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <EditableTextView placeholder={'Contact name'} defaultValue={profile && profile.firstname} name="contact_persion" onSubmit={(e) => { handleChange('contact_persion', e.target.value) }}></EditableTextView>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <EditableTextView placeholder={'Phone'} defaultValue={profile && profile.lastname} name="contact_phone" onSubmit={(e) => { handleChange('contact_phone', e.target.value) }}></EditableTextView>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <EditableTextView placeholder={'Email'} defaultValue={profile && profile.lastname} name="contact_email" onSubmit={(e) => { handleChange('contact_email', e.target.value) }}></EditableTextView>
                    </Grid>
                </Grid>        
                <Divider sx={{ my: 1 }}></Divider>
                <Typography variant='overline' color="text.secondary"  mt={4} >
                    Company ADDRESS
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <EditableTextView defaultValue={profile.address} label={"Address"} placeholder={'No. Street'} name="address" onSubmit={(e) => { handleChange('address', e.target.value) }}></EditableTextView>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <EditableTextView defaultValue={profile.city} placeholder={'City'} name="city" onSubmit={(e) => { handleChange('city', e.target.value) }}></EditableTextView>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <EditableTextView defaultValue={profile.province} placeholder={'Province'} name="province" onSubmit={(e) => { handleChange('province', e.target.value) }}></EditableTextView>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <EditableTextView defaultValue={profile.country} placeholder={'Country'} name="country" onSubmit={(e) => { handleChange('country', e.target.value) }}></EditableTextView>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <EditableTextView defaultValue={profile.postcode} label={"Zipcode"} placeholder={'Zipcode'} name="postcode" onSubmit={(e) => { handleChange('postcode', e.target.value) }}></EditableTextView>
                    </Grid>
                </Grid>
                {loading && <Backdrop open={loading?true:false}/>}
                {changeResult && <Snackbar open={changeResult?true:false} onClose={()=>setChanged()} autoHideDuration={6000} anchorOrigin={{ vertical:'bottom',horizontal:'center' }}>
                    <Alert severity={changeResult.success?"success":"warning"} sx={{ width: '100%' }}>
                        {changeResult.data}
                    </Alert>
                </Snackbar>}
            </Paper> :
            <Box sx={{ display: 'flex', paddingLeft: '50%' }} mt={15}>
                <CircularProgress />
            </Box>
    )
}

export default MerchantProfile