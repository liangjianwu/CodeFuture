import {useEffect, useState} from 'react';
import {Avatar,Alert,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

import { apiResult,formToJson,getUserSession,sessionSet, setUserSession } from '../../../Utils/Common';
import apis from '../../../api';
import { balance_products } from '../config';
import { loadCoaches } from '../../../App/DataLoad';
const EditProductForm = (props) => {
    const [fieldErrors, setFieldErrors] = useState()
    const [error, setError] = useState()    
    const [coaches,setCoaches] = useState()
    const [coach,setCoach] = useState(0)
    const [balancetype,setBalanceType] = useState(props.product && props.product.chargeto)
    const session = getUserSession(apis)
    useEffect(()=>{
        loadCoaches(apis,(data)=>{
            setCoaches(data)
        },setError)
    },[])
    useEffect(()=>{
        props.product && setCoach(props.product.coach_id)
    },[props.product])
    const handleBalanceProductChange = (e)=>{
        setBalanceType(e.target.value)
    }
    const handleCoachChange = (e)=>{
        setCoach(e.target.value)
    }
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        if(!balancetype) {
            setError('You must select one charge balance')
            return
        }
        const data = new FormData(event.currentTarget);
        const postdata = formToJson(data)
        postdata.chargeto = balancetype
        postdata.coach_id = coach
        postdata.id = props.product ? props.product.id:0
        apis.editProduct(postdata).then(ret => {
            apiResult(ret, (data) => {
                sessionSet('products',null)
                props.onClose && props.onClose(data)
            }, setError, setFieldErrors)
        })
    }
    return <><Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
            <Typography component="h1" variant="h5"> Add or Edit Product </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField margin="normal" type="text" name="name" defaultValue={props.product&&props.product.name} required fullWidth id="name" label="Product name" 
                error={fieldErrors && fieldErrors.name ? true : false}
                helperText={fieldErrors && fieldErrors?.name}
                autoFocus />
                <TextField multiline={true} rows={4} margin="normal" type="text"  defaultValue={props.product&&props.product.description} name="description" fullWidth id="description" label="Product description" 
                error={fieldErrors && fieldErrors.description ? true : false}
                helperText={fieldErrors && fieldErrors?.description}/>
                <TextField margin="normal" type="int" name="minutes" fullWidth id="minutes" label="Minutes"  defaultValue={props.product&&props.product.minutes}
                error={fieldErrors && fieldErrors.minutes ? true : false}
                helperText={fieldErrors && fieldErrors?.minutes}/>
                <TextField margin="normal" type="decimal" name="price" required fullWidth id="price" label="Product price"  defaultValue={props.product&&props.product.price}
                error={fieldErrors && fieldErrors.price ? true : false}
                helperText={fieldErrors && fieldErrors?.price}/>
                <FormControl fullWidth sx={{mt:2}}>
                    <InputLabel id="demo-simple-select-autowidth-label">Charge balance</InputLabel>
                    <Select labelId="demo-simple-select-autowidth-label"                        
                        onChange={handleBalanceProductChange}
                        label="Select balance"
                        value={props.product && props.product.chargeto}
                    >
                        <MenuItem key={'-1'} value={'none'}>{"None"}</MenuItem>
                        {balance_products && balance_products.map((p, idx) => {
                            return <MenuItem key={idx} value={p.value}>{p.label}</MenuItem>
                        })}

                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{mt:2}}>
                    <InputLabel id="demo-simple-select-autowidth-label1">Associate Coach</InputLabel>
                    <Select labelId="demo-simple-select-autowidth-label1" 
                        label="Select coach"                        
                        value={coach}
                        onChange={handleCoachChange}
                    >
                        <MenuItem key={'-1'} value={0}>{"None"}</MenuItem>
                        {coaches && coaches.map((p, idx) => {
                            return <MenuItem key={idx} value={p.id}>{p.name}</MenuItem>
                        })}

                    </Select>
                </FormControl>
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Submit </Button>
                <Button type="button" fullWidth variant="outlined" onClick={()=>{props.onClose && props.onClose(false) }} sx={{ mt: 1, mb: 2 }} > Cancel </Button>
            </Box>
        </Box>
    </Container></>
}

export default EditProductForm