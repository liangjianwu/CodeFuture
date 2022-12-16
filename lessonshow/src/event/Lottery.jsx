import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CopyRight from '../Component/CopyRight'
import apis from '../api';
import { apiResult, } from '../Utils/Common';
import { useParams } from 'react-router';
import { Paper, Typography, Alert,Grid } from '@mui/material';

export default function Lottery(props) {
    const [error, setError] = useState()
    const [applicants, setApplicants] = useState([])
    const params = useParams()
    const [list,setList] = useState([])
    const [randomIdx,setRandomIdx] = useState(-1)
    const [currentRnd,setCurrentRnd] = useState(-1)
    const count = useRef(0)
    useEffect(() => {
        apis.loadApplicants(params.code).then(ret => {
            apiResult(ret, data => {
                setApplicants(data)
            }, setError)
        })
    }, [params.code])

    
    const randomSelect = ()=>{
        let rnd = Math.floor(Math.random()*100000)%applicants.length        
        setCurrentRnd(rnd)        
        count.current = count.current + 1
        if(count.current<20) {
            window.setTimeout(randomSelect,400)
        }else {            
            if(list.indexOf(rnd)>=0) {
                window.setTimeout(randomSelect,400)
            }else {
                setCurrentRnd(rnd)
                count.current = 0
                setList([...list,rnd])
            }
        }
    }
    const handleClick = ()=>{        
        window.setTimeout(randomSelect,200)    
    }
    return (<>

        <Container component="main" maxWidth="hg">
            <CssBaseline />
            <Typography sx={{mt:4,mb:1}} variant={'h5'}>幸运抽奖</Typography>
            {error && <Alert severity='error' onClose={() => setError()} sx={{ mt: 1, mb: 1 }}>{error}</Alert>}
            <Grid container spacing={1}>
                {applicants && applicants.map((applicant, idx) => (
                    <Grid item xs={2}>
                        <Paper key={idx} sx={{ p: 1.8, width: '100%',height:'60px',bgcolor: idx==currentRnd?'Highlight':'#fff',color:idx==currentRnd?'white':'black'}}>
                            <Typography variant={idx==currentRnd?'h4':'h5'}>{applicant.id + (idx==currentRnd?(":"+applicant.name):'')} </Typography>
                        </Paper>
                    </Grid>
                ))}
                <Grid item xs={2}>
                    <Button variant='contained' sx={{width:'100%',height:'60px'}} onClick={handleClick}>抽奖</Button>
                </Grid>
            </Grid>
            
            <Typography sx={{mt:4,mb:1}} variant={'h5'}>获奖名单：</Typography>
            <Grid container spacing={1}>
                {list && list.map((i, idx) => (
                    <Grid item xs={2}>
                        <Paper key={idx} sx={{ p: 1.8, width: '100%',height:'60px',bgcolor: 'green',color:'white'}}>
                            <Typography variant={'h5'}>{applicants[i].id + ":"+applicants[i].name} </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            
            <CopyRight sx={{ mt: 5 }} />
        </Container>
    </>
    );
}
