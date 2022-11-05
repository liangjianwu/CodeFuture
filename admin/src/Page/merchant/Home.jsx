import { Item, Title } from "../../Component/MuiEx"
import { Button, Grid, Stack,  Typography, Alert, Paper, Divider, } from '@mui/material';
import { useEffect, useState } from "react";
import { apiResult, getUserSession,  } from "../../Utils/Common";
import apis from "../../api";
import AddCompanyDialog from "./fragement/AddCompanyDialog";
import JoinCompanyDialog from "./fragement/JoinCompanyDialog";
const MerchantHome = (props) => {
    const [profile, setUserProfile] = useState({})
    const [error, setError] = useState()
    const [showDialog, setShowDialog] = useState(false)
    const [showDialog1, setShowDialog1] = useState(false)
    getUserSession(apis)        
    useEffect(() => {        
        apis.userMerchant().then(ret => {
            apiResult(ret, setUserProfile, setError)
        })
    }, [])
    const handleDialogClose = () => {
        setShowDialog(false)
    }
    const handleDialogSubmit = (result) => {
        setShowDialog(false)
        //sessionSet('merchant_auth',result)
        window.location.href = '/service/dashboard'
    }
    const handleDialog1Close = () => {
        setShowDialog1(false)
    }
    const handleDialog1Submit = (result) => {
        setShowDialog1(false)
        //sessionSet('merchant_auth',result)
        window.location.href = '/service/dashboard'
    }
    const handleAdd = () => {
        setShowDialog(true)
    }
    const handleJoin = ()=>{
        setShowDialog1(true)
    }
    const handleGetPwd = ()=>{
        apis.merchantPwd().then(ret=>{
            apiResult(ret,data=>{
                alert("Your company password is :"+ data)
            },setError)
        })
    }
    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Title>Company or bussiness information</Title>
                        {profile && profile.merchant ? <>
                            <Typography variant="body1" component="div" gutterBottom>
                                {profile && profile.merchant.type == 0?"Company name":"Business name"}: <b>{profile && profile.merchant.name}</b>
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Industry: <b>{profile && profile.merchant.industry}</b>
                            </Typography>
                            <Button variant="contained" sx={{width:'200px'}} onClick={handleGetPwd}>Get company password</Button>
                        </> :
                            <>
                                <Alert severity="info">You don't have any company or business information yet!</Alert>
                                <Stack spacing={2} mt={2} direction="row">
                                    <Button variant="text" onClick={handleAdd}>Add</Button>
                                    <Button variant="text" onClick={handleJoin}>Join</Button>
                                </Stack>
                            </>
                        }
                    </Paper>
                </Grid>
                {profile && profile.roles && <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Title>Your role</Title>
                        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                            {profile.roles.map((role, index) => {
                                return <Item key={index}>{role.name}</Item>
                            })}
                        </Stack>
                    </Paper>
                </Grid>}
            </Grid>
            {showDialog && <AddCompanyDialog open={showDialog} onClose={handleDialogClose} onSubmit={handleDialogSubmit} />}
            {showDialog1 && <JoinCompanyDialog open={showDialog1} onClose={handleDialog1Close} onSubmit={handleDialog1Submit} />}
        </>
    );
}

export default MerchantHome