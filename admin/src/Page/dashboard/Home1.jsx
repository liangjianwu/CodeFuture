import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { Alert, Button, Backdrop, CircularProgress } from '@mui/material';
import { Title } from '../../Component/MuiEx';
import { useNavigate } from 'react-router';
import { apiResult, getUserSession } from '../../Utils/Common';
import apis from '../../api';
import { MerchantInfo, ServiceCardItem } from './Component';
import { loadDashBoard } from '../../App/DataLoad';

function DashboardContent() {
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [content, setContent] = useState({})
    const session = getUserSession(apis)
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        apis.loadDashBoard().then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                setContent(data)
            }, setError)
        })
        loadDashBoard(apis, (data) => {
            setLoading(false)
            setContent(data)
        }, (err) => {
            setLoading(false)
            setError(err)
        })
    }, [])

    const handleServiceApply = (service) => {
        apis.applyService(service.id).then(ret => {
            apiResult(ret, (data) => {
                navigate(service.url)
            }, setError)
        })
    }

    return (

        loading ? <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
        </Backdrop> : <>
            <Grid container spacing={3} pt={3}>
            <Grid item xs={12} md={12} lg={12}>
                {error && <Alert severity={"error"}>{error}</Alert>}
                {/* Notification */}
                {!content.merchant && <Alert severity="info" sx={{mt:1}} action={<Button color="inherit" onClick={() => { navigate('/service/merchant/home') }} size="small">TO DO</Button>}>
                    You need to set up company or personal business related information to use our service, go to set it now?
                </Alert>}
                {session.email_verified === 0 && <Alert  sx={{mt:1}} severity="info" action={<Button color="inherit" onClick={() => { navigate('/service/user/emailverify') }} size="small">TO DO</Button>}>
                    Your email has not been verified yet!
                </Alert>}
                </Grid>
                {/* <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Title>Notification</Title>
                                            
                    </Paper>
                </Grid> */}
                {content.services && content.services.map((service, index) => {
                return <Grid item xs={12} md={3} lg={4}>
                       <ServiceCardItem service={service} key={index} myservices={content.myservices} onApply={handleServiceApply}></ServiceCardItem>
                </Grid>
                })}
            </Grid>


        </>
    );
}

export default function Home() {
    return <DashboardContent />;
}
