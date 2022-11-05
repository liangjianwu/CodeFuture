import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CopyRight from '../Component/CopyRight'
import apis from '../api';
import { apiResult, getUserSession, sessionSet } from '../Utils/Common';
import { useLocation, useNavigate, useParams } from 'react-router';
import FormGenerator from '../Component/template/FormGenerator';


import { Alert, Paper, Snackbar, Avatar, Typography } from '@mui/material';
import EventPayForm from './EventPayForm';


function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Event(props) {
    const [error, setError] = useState()
    const [apply, setApply] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [event, setEvent] = useState()
    const [form, setForm] = useState()
    const [step, setStep] = useState(0)
    const session = getUserSession(apis)
    const query = useQuery()
    const params = useParams()
    const navigate = useNavigate()
    const [changed, setChanged] = useState(false)

    useEffect(() => {
        let result = query.get('paycallback')== 'success'
        let applyid = result ?query.get('applyid'):0
        let token = result?query.get('token'):0
        let time = result?query.get('time'):0
        apis.getEvent(params.code,applyid,token,time).then(ret => {
            apiResult(ret, data => {
                setEvent(data.event)
                data.event.form && setForm(data.event.form)
                data.apply && data.apply != null && setApply(data.apply)
                data.apply && data.apply != null && (data.event.pay == 1 && data.apply.pay_status == 1 ? setStep(2) : setStep(1))                
                if (query.get('paycallback') && query.get('paycallback') != 'success' && apply && apply.pay_status == 0) {
                    setStep(2)
                    setError("Failed to pay the event fee")
                }
            }, setError)
        })
    }, [params.code])
    const handleSign = () => {
        sessionSet('loginCallback', '/event/' + params.code)
        navigate('/user/signin')
    }
    const handleApply = () => {
        setStep(1)
    }
    const handleHintClose = () => {
        setHintMsg()
    }
    const handleChange = (index, index1, value) => {
        let ff = [...form]
        ff[index].items[index1].value = value
        setForm(ff)
        setChanged(true)
    }
    const handleSubmit = () => {
        let postdata = {
            id: 0,
            event_id: event.id,
            form: JSON.stringify(form),
        }
        if (apply) {
            postdata.id = apply.id
            postdata.code = apply.code
        }
        setError()
        apis.applyEvent(postdata).then(ret => {
            apiResult(ret, data => {
                setApply(data)
                setStep(2)
            }, setError)
        })
    }
    return (<>

        {event && <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
                <Box>
                    <div style={{ border: 1, width: "100%", overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: event.html }}></div>
                    {!apply && event.apply == 1 && step==0 && (event.sign == 1 && (!session || session.email_verified != 1) ? <Button fullWidth variant='contained' onClick={handleSign} sx={{ maraginTop: 4 }}>Login to apply</Button> : <Button onClick={handleApply} variant={'contained'} fullWidth sx={{ maraginTop: 4 }}>Apply</Button>)}
                </Box>
                <Box sx={{ width: '100%' }}>
                    {((apply && event.pay == 1 && apply.pay_status == 0 && step < 2) || step === 1) && event.apply == 1 && <FormGenerator form={form} onChange={handleChange} />}
                    {((apply && apply.pay_status == 0) && step === 2) && event.apply == 1 && event.pay == 1 && <Paper sx={{ p: 2, mt: 2, borderColor: '#059c' }}>
                        {event && apply && <EventPayForm applyid={apply.id} applycode={apply.code} amount={event.fee} />}
                    </Paper>}
                    {((apply && apply.pay_status == 1) && step === 2) && event.apply == 1 && event.pay == 1 && <Paper sx={{ p: 2, mt: 2, borderColor: '#059c' }}>
                        <Typography variant='body1'>Event fee: <span style={{ fontWeight: 'bold' }}>CAD ${event.fee}</span></Typography>
                        <Typography variant='body1' color="#ff5722" sx={{ mt: 2, mb: 2 }}>You have applied and paid successfully</Typography>
                        <Typography variant='body1'>Apply number:  <span style={{ fontWeight: 'bold', color: '#ff5722' }}>{apply && apply.id}</span></Typography>
                        <Typography variant='body1'>Paid amount:  <span style={{ fontWeight: 'bold', color: '#ff5722' }}>CAD ${apply && apply.pay_amount}</span></Typography>
                        <Typography variant='body1'>Paid time  : <span style={{ fontWeight: 'bold', color: '#ff5722' }}>{apply && apply.pay_time}</span></Typography>
                    </Paper>}
                    {apply && step === 2 && event.apply == 1 && event.pay == 0 && <Paper sx={{ p: 2, mt: 2, borderColor: '#059c' }}>
                        <Typography variant='body1' color="#ff5722" sx={{ mt: 2, mb: 2 }}>You have applied successfully</Typography>
                        <Typography variant='body1'>Apply number:  <span style={{ fontWeight: 'bold', color: '#ff5722' }}>{apply && apply.id}</span></Typography>
                    </Paper>}
                    {error && <Alert severity='error' onClose={() => setError()} sx={{ mt: 1, mb: 1 }}>{error}</Alert>}
                    {step > 0 && (event.pay == 0 || (apply && apply.pay_status == 0) || step === 1) && step != 2 && event.apply == 1 && <Button sx={{ marginTop: 2 }} fullWidth variant='contained' onClick={() => handleSubmit(true)}>{event.pay == 1 ? 'Next' : (apply ? 'Modify' : 'Submit')}</Button>}
                    {step > 1 && <Button sx={{ marginTop: 2 }} fullWidth variant='outlined' onClick={() => { setStep(1); setChanged(false) }}>Back to modify</Button>}
                </Box>
                {/* {step === 2 && (event.pay == 0 || apply.pay_status == 1) && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><AutoAwesomeIcon /></Avatar>
                    <Typography component="h1" variant="h5"> Applied successfully </Typography>
                    <Typography component="body" variant="body" sx={{mt:3,mb:10}}> You have succeed to apply the event! </Typography>
                    
                    <Button type="button" variant='contained' onClick={handleClose} fullWidth sx={{ mt: 3, mb: 2 }} > Back  </Button>                    
                    <Button type="button" variant='outlined' onClick={handleModify} fullWidth sx={{ mb: 2 }} > modify </Button>                    
                </Box>}
                {step === 2 && (event.pay == 1 && apply.pay_status == 0) && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    
                    <Button type="button" variant='contained' onClick={handleClose} fullWidth sx={{ mt: 3, mb: 2 }} > Pay  </Button>
                    <Button type="button" variant='outlined' onClick={handleModify} fullWidth sx={{ mb: 2 }} > Back </Button>                    
                </Box>} */}
            </Box>
            <CopyRight sx={{ mt: 5 }} />
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </Container>}
    </>
    );
}
