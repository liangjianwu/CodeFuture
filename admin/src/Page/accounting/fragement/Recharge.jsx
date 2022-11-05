import { useState } from 'react';
import { Avatar, Alert ,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

import { apiResult, getUserSession,  } from '../../../Utils/Common';
import apis from '../../../api';
import { balance_products } from '../config';
const Recharge = (props) => {    
    const [data,setData] = useState({date:new Date().toLocaleDateString(),type:'privateclass'})    
    const [error, setError] = useState()
    getUserSession(apis)

    const handleSubmit = (event) => {        
        setError()
        event.preventDefault();        
        data.customerid = props.customerid?props.customerid:0
        data.familyid = props.familyid?props.familyid:0
        let keys = Object.keys(data)
        keys.map(key=>{
            if(data[key] == null ) {
                delete data[key]
            }
        })
        apis.recharge(data).then(ret => {
            apiResult(ret, (data) => {
                props.onClose && props.onClose(data)
            }, setError)
        })
    }
    const handleChange = (k,v) =>{
        setData({...data,[k]:v})
    }

    return <><Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
            <Typography component="h1" variant="h5"> Recharge </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-autowidth-label">Recharge to</InputLabel>
                    <Select labelId="demo-simple-select-autowidth-label"
                        id="product"
                        onChange={(e)=>{handleChange('type',e.target.value)}}
                        label="Select "
                        value={'privateclass'}
                        disabled = {true}
                    >
                        {balance_products && balance_products.map((p, idx) => {
                            return <MenuItem key={idx} value={p.value}>{p.label}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <TextField margin="normal" type="number" name="amount" required fullWidth id="amount" label="Amount" onChange={(e)=>{handleChange('amount',e.target.value)}}/>
                <TextField margin="normal" type="text" multiline name="note" fullWidth id="note" label="Note" onChange={(e)=>{handleChange('note',e.target.value)}}/>
                <TextField margin="normal" type="text" multiline name="invoice" fullWidth id="invoice" label="Invoice" onChange={(e)=>{handleChange('invoice',e.target.value)}}/>
                <TextField margin="normal" type="date" name="date" onChange={(e)=>handleChange('date',e.target.value)} value={data.date} fullWidth id="date" label="Date"InputLabelProps={{ shrink: true }} />
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Recharge </Button>
                <Button type="button" fullWidth variant="outlined" onClick={() => { props.onClose && props.onClose(false) }} sx={{ mt: 1, mb: 2 }} > Cancel </Button>
            </Box>
        </Box>
    </Container></>
}

export default Recharge