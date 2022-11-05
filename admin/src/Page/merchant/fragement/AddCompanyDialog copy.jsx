import { Button, Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions, TextField, Alert,} from '@mui/material';
import { useState } from 'react';

const AddCompanyDialog = (props)=>{   
    const [value,setValue]=useState()
    const [error,setError] = useState()
    const handleChange=(e)=>{
        setValue(e.target.value)
    } 
    const handleOnSubmit = (e)=>{        
        setError()
        if(value && value.length>2 && value.length<64) {
            props.onSubmit && props.onSubmit(value)
        }else {
            setError('The name length should be between 3~64')
        }        
    }
    return (<Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Company or business information</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please input your company name
            </DialogContentText>
            <TextField autoFocus onChange={handleChange} sx={{minWidth:300}} margin="dense" id="name" label="Company name" type="text" fullWidth variant="standard"/>
            {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={handleOnSubmit} variant='contained'>Submit</Button>
        </DialogActions>
    </Dialog>)
}
export default AddCompanyDialog