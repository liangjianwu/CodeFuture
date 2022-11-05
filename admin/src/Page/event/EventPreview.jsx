import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CopyRight from '../../Component/CopyRight'
import apis from '../../api';
import { apiResult, getUserSession, } from '../../Utils/Common';
import { useParams } from 'react-router';
import FormGenerator from '../../Component/template/FormGenerator';

export default function EventPreview(props) {
    const [error, setError] = useState()
    const [event, setEvent] = useState()
    const [form, setForm] = useState()
    const [step,setStep] = useState(0)
    const session = getUserSession(apis)
    const params = useParams()
    useEffect(() => {
        apis.getEvent(params.id).then(ret => {
            apiResult(ret, data => {
                setEvent(data)
                data.form && data.form.length > 0 && setForm(JSON.parse(data.form))
            }, setError)
        })
    }, [])
    
    return (
        event && <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                {step === 0 && <Box sx={{padding:2}}>
                    <div style={{ border: 1, width: "100%", minHeight: 400, maxHeight: 800, overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: event.html }}></div>
                    {event.sign == 1 ? <Button fullWidth variant='contained' onClick={()=>setStep(1)}>Sign to apply</Button>:<Button onClick={()=>setStep(1)} fullWidth>Apply</Button>}
                </Box>}
                {step === 1 && <Box sx={{width:'100%'}}>
                    <FormGenerator form={form} />
                    <Button sx={{marginTop:2}} fullWidth variant='contained'>Submit</Button>
                    <Button sx={{marginTop:2}} fullWidth variant='outlined' onClick={()=>setStep(0)}>Back</Button>
                </Box>}
            </Box>
            <CopyRight sx={{ mt: 5 }} />
        </Container>
    );
}
