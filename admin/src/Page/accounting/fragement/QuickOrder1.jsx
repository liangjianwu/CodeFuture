
import {  Alert, TextField, Grid, Autocomplete, Button, IconButton } from "@mui/material";
import { useRef,useEffect, useState } from 'react';
import { Add } from "@mui/icons-material";
import { MemberLevel } from "../../../Component/MuiEx";
import { useNavigate } from "react-router";

const QuickOrder1 = (props) => {
    const [order, setOrder] = useState({count:1,peoples:1,date:new Date().toLocaleDateString()})
    const [error,setError] = useState() 
    const [timeStamp,setTimeStamp] = useState()
    const navigate = useNavigate()
    const handleOrderChange = (key, value) => {
        setError()
        setOrder({...order,[key]:value})
    }
    const inputRef = useRef()
    useEffect(()=>{
        inputRef.current ?.focus()
        if(inputRef.current) {
            inputRef.current.focus()                        
        }
        
    },[timeStamp])
    const handleAddOrder = () => {
        setError()        
        if(order.product && order.group && order.count>0 && order.date && order.date.length === 10) {
            props.onAdd && props.onAdd(order)
            setOrder({...order})             
            setTimeStamp(Date.now())
        }else {
            setError("invalid data")
        }
    }

    const setTextInputRef = (element) => {
        inputRef.current = element;
      };
    return <Grid container spacing={2}>
        {error && <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>}
        <Grid item lg={4}>
            <Autocomplete disablePortal id="product-selector"
                options={props.products}
                autoComplete
                autoHighlight
                autoSelect                
                getOptionLabel={(option) => option.name}
                onChange={(_event, value) => { handleOrderChange('product', value) }}
                renderInput={(params) => <TextField {...params} label="Product" />}
            />
        </Grid>
        
        <Grid item lg={2}>
            <TextField  
                type="date" 
                margin="normal" 
                sx={{mt:"0"}}
                InputLabelProps={{ shrink: true }} 
                fullWidth 
                label={"Date"} 
                value={order.date} 
                onChange={(e) => { handleOrderChange('date', e.target.value) }} 
            />
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Date"
                    value={order.date && (order.date+ " 12:00:00")}
                    onChange={(date) => { handleOrderChange('date', formatDate(date)) }}                    
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider> */}
        </Grid>
        <Grid item lg={2}>
            <TextField fullWidth type="number" defaultValue={1} label="Number of members" onChange={(e) => { handleOrderChange('peoples', e.target.value) }} />
        </Grid>
        <Grid item lg={4}>
            <TextField fullWidth type="text" label="Note" onChange={(e) => { handleOrderChange('note', e.target.value) }} />
        </Grid>
        <Grid item lg={4}>
            <Autocomplete disablePortal id="group-selector"
                options={props.groups}
                autoComplete
                autoHighlight
                autoSelect                
                getOptionLabel={(option) => option.name }                
                onChange={(_event, newitem) => { handleOrderChange('group', newitem) }}                
                renderInput={(params) => <TextField {...params} label="Group" inputRef={setTextInputRef} />}
            />
        </Grid>
        <Grid item lg={2}>
            <TextField fullWidth type="number" defaultValue={1}                
                label="Minutes" onChange={(e) => { handleOrderChange('count', e.target.value) }} />
        </Grid>
        <Grid item lg={1}>
            <IconButton onClick={handleAddOrder} ><Add /></IconButton>
        </Grid>
        <Grid item lg={3}>
            <Button variants="outlined" onClick={()=>{navigate('/accounting/memberscharge')}} >Switch to members charge</Button>
        </Grid>

    </Grid>
}

export default QuickOrder1