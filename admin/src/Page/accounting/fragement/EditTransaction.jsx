import { useState } from 'react';
import { Avatar, Alert ,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

import { apiResult, formToJson, getUserSession,  } from '../../../Utils/Common';
import apis from '../../../api';
const EditTransaction = (props) => {        
    const [error, setError] = useState()
    getUserSession(apis)

    const handleSubmit = (event) => {           
        if(!props.transaction) {
            setError("No transaction has been selected")
            return
        }
        setError()
        event.preventDefault();        
        const data = new FormData(event.currentTarget);
        const postdata = formToJson(data)
        let keys = Object.keys(data)
        keys.map(key=>{
            if(data[key] == null ) {
                delete data[key]
            }
        })
        postdata.id = props.transaction.id
        apis.editTransaction(postdata).then(ret => {
            apiResult(ret, (data) => {
                props.onClose && props.onClose(postdata)
            }, setError)
        })
    }

    return <><Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
            <Typography component="h1" variant="h5"> Edit Transaction </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>                
                <TextField margin="normal" type="text" multiline name="note" fullWidth id="note" label="Note" defaultValue={props.transaction?.note}/>
                <TextField margin="normal" type="number" multiline name="peoples" fullWidth id="peoples" label="Number of members" defaultValue={props.transaction?.order?.peoples}/>
                <TextField margin="normal" type="text" multiline name="invoice" fullWidth id="invoice" label="Invoice" defaultValue={props.transaction?.invoice}/>
                <TextField margin="normal" type="date" name="order_date" defaultValue={props.transaction?.order?.order_date.substring(0,10)} fullWidth id="order_date" label="Date" InputLabelProps={{ shrink: true }} />
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Submit </Button>
                <Button type="button" fullWidth variant="outlined" onClick={() => { props.onClose && props.onClose(false) }} sx={{ mt: 1, mb: 2 }} > Cancel </Button>
            </Box>
        </Box>
    </Container></>
}

export default EditTransaction