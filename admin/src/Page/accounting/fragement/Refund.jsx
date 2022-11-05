import { useEffect, useState } from 'react';
import { Typography, Avatar, Paper, Container, CssBaseline, Alert, TextField, Button, Box, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { apiResult, formToJson, } from '../../../Utils/Common';
import apis from '../../../api';
const Refund = (props) => {    
    const [fieldErrors, setFieldErrors] = useState()
    const [error, setError] = useState()
    const [balance, setBalance] = useState()
    const [date,setDate] = useState(props.item && props.item.order ? props.item.order.order_date.substring(0,10) : new Date().toLocaleDateString())
    const [refunded, setRefuned] = useState()
    const [amount, setAmount] = useState(props.item && Math.abs(props.item.amount))
    const [product,setProduct] = useState()
    const [count,setCount] = useState(props.item && props.item.order?.count)
    const [note, setNote] = useState(props.item && ("Refund from transaction No." + props.item.id))
    let initpage = false
    useEffect(() => {
        if (initpage) return
        initpage = true
        if (!props.item) return
        apis.gettransaction({ id: props.item.id }).then(ret => {
            apiResult(ret, (data) => {
                setRefuned(data.refundAmount)                
                setBalance(data.customerBalance)
                data.product && setProduct(data.product)
            })
        })
    },[])
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        if (!props.item) return
        const data = new FormData(event.currentTarget);
        const postdata = formToJson(data)
        postdata.refer = props.item.id

        if (postdata.amount > Math.abs(props.item.amount)) {
            setError('You can not refund the amount that more than the original amout of the transaction')
            return
        }
        if (Math.abs(props.item.amount) > postdata.amount) {
            if (!window.confirm('Are you sure to refund partially?')) return
        }
        if (postdata.amount > 0 && postdata.refer > 0) {
            apis.refund(postdata).then(ret => {
                apiResult(ret, (data) => {
                    props.onClose && props.onClose(data)
                }, setError, setFieldErrors)
            })
        }
    }
    const handleAmountChange = (e) => {
        setAmount(e.target.value)
        props.item.order && props.item.order.product_id > 0 && product && product.minutes>0 && setCount((Number(e.target.value)*1.0/Number(product.price)*Number(product.minutes)).toFixed(2))
    }
    const handleCountChange = (e)=>{
        setCount(e.target.value)
        props.item.order && props.item.order.product_id > 0 && product && product.minutes>0 && setAmount((Number(e.target.value)*1.0/Number(product.minutes)*Number(product.price)).toFixed(2))
    }
    const handleNoteChange = (e) => {
        setNote(e.target.value)
    }
    const handleDateChange =(e)=>{
        setDate(e.target.value)
    }
    return <><Container component="main" maxWidth="xs">
        <CssBaseline />
        {props.item && <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
            <Typography component="h1" variant="h5"> Refund </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography sx={{ mt: 1 }} variant="h6h">Current transaction information</Typography>
                    <Typography sx={{ mt: 1 }} variant="body1"><b>Number:</b> {props.item.id}</Typography>
                    <Typography sx={{ mt: 1 }} variant="body1"><b>Subject:</b> {props.item.subject}</Typography>
                    <Typography sx={{ mt: 1 }} variant="body1"><b>Amount:</b> $ {Math.abs(props.item.amount)}</Typography>
                    {refunded != undefined && <Typography sx={{ mt: 1 }} variant="body1"><b>Refunded:</b> $ {Math.abs(refunded)}</Typography>}
                    {product && <Typography sx={{ mt: 1 }} variant="body1"><b>Product:</b> ${product.price}/{product.minutes} mins</Typography>}
                    {balance && <Typography sx={{ mt: 1 }} variant="body1"><b>Balance:</b> $ {balance}</Typography>}
                    <Typography sx={{ mt: 1 }} variant="body1"><b>Note:</b> {props.item.note}</Typography>
                </Paper>                             
                <TextField margin="normal" type="text" name="amount" onChange={handleAmountChange} value={amount} required fullWidth id="amount" label="Refund Amount"
                    error={fieldErrors && fieldErrors.amount ? true : false}
                    helperText={fieldErrors && fieldErrors?.amount}
                />
                <TextField margin="normal" type="text" name="count" onChange={handleCountChange} value={count} disabled required fullWidth id="count" label="Refund Minutes"
                    error={fieldErrors && fieldErrors.count ? true : false}
                    helperText={fieldErrors && fieldErrors?.count}
                />   
                <TextField margin="normal" type="text" name="note" onChange={handleNoteChange} value={note} fullWidth multiline rows={2} id="note" label="Note"
                    error={fieldErrors && fieldErrors.note ? true : false}
                    helperText={fieldErrors && fieldErrors?.note}
                />
                <TextField margin="normal" type="date" name="date" onChange={handleDateChange} value={date} fullWidth id="date" label="Date"
                    error={fieldErrors && fieldErrors.date ? true : false}
                    helperText={fieldErrors && fieldErrors?.date}
                    InputLabelProps={{ shrink: true }} 
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Refund </Button>
                <Button type="button" fullWidth variant="outlined" onClick={() => { props.onClose && props.onClose(false) }} sx={{ mb: 2 }} > Cancel </Button>
            </Box>
        </Box>}
    </Container></>
}

export default Refund