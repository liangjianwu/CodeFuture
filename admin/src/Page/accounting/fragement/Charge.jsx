import { useState } from 'react';
import { Typography, Avatar, Select, Container, CssBaseline, FormControl, InputLabel, MenuItem, Alert, TextField, Button, Box, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { apiResult, formToJson, } from '../../../Utils/Common';
import apis from '../../../api';
import {  getBalanceProduct } from '../config';

const Charge = (props) => {
    const getProductById = (id) => {
        for (let i = 0; i < props.products.length; i++) {
            if (props.products[i].id == id) {
                return props.products[i]
            }
        }
        return undefined
    }
    const [fieldErrors, setFieldErrors] = useState()
    const [error, setError] = useState()
    const [product, setProduct] = useState(props.order && props.order.order && getProductById(props.order.order.product_id))
    const [count, setCount] = useState(props.order && props.order.order ? props.order.order.count : 0)
    const [price, setPrice] = useState(props.order ? Math.abs(props.order.amount) : 0)
    const [note, setNote] = useState(props.order && props.order.note)
    const [date, setDate] = useState(props.order && props.order.order ? new Date(props.order.order.order_date).toLocaleDateString() : new Date().toLocaleDateString())
    const handleSubmit = (event) => {
        setFieldErrors()
        setError()
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postdata = formToJson(data)
        postdata.customers = props.customers ? props.customers : [props.customerid]
        postdata.product_id = product ? product.id : 0
        postdata.date = date
        postdata.transaction_id = props.order ? props.order.id : 0

        if (product && (product.price * (count * 1.0 / product.minutes)).toFixed(2) != postdata.amount) {
            if (!window.confirm('The amount that you has inputed does not equal to the product price, are you sure to continue?')) return
        }
        if (postdata.amount >= 0 && postdata.product_id > 0) {
            apis.charge(postdata).then(ret => {
                apiResult(ret, (data) => {
                    props.onClose && props.onClose(data)
                }, setError, setFieldErrors)
            })
        }
    }

    const handleProductChange = (e) => {
        let id = e.target.value
        if (id >= 0 && props.products) {            
            let p = getProductById(id)            
            if (p) {                
                setProduct(p)
                count >= 0 ? setPrice((count * 1.0 / Number(p.minutes) * Number(p.price)).toFixed(2)) : setPrice(p.price)
                count > 0 ? setNote(count + " minutes " + p.name) : setNote(p.name)
            }
        }
    }
    const handlePriceChange = (e) => {
        setPrice(e.target.value)
    }
    const handleDateChange = (date) => {
        setDate(date)
    }
    const handleNoteChange = (e) => {
        setNote(e.target.value)
    }

    const handleCountChange = (e) => {
        const nn = Number(e.target.value)
        setCount(nn)
        product && (nn > 0 ? setNote(nn + " mins " + product.name) : setNote(product.name))
        product && (nn >= 0 ? setPrice((nn * 1.0 / product.minutes * Number(product.price)).toFixed(2)) : setPrice(product.price))
    }
    return <><Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
            <Typography component="h1" variant="h5"> Charge </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-autowidth-label">Select product</InputLabel>
                    <Select labelId="demo-simple-select-autowidth-label"
                        id="product"
                        onChange={handleProductChange}
                        label="Select product"
                        defaultValue={props.order && props.order.order && props.order.order.product_id}
                    >
                        {props.products && props.products.map((p, idx) => {
                            return <MenuItem key={idx} value={p.id}>{p.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                {product && <Paper sx={{ p: 2, mt: 1, mb: 1 }}>
                    <Typography sx={{ mb: 2 }} variant="body1">Price: <b>${product.price} / {product.minutes}minutes</b></Typography>
                    <Typography sx={{ mb: 2 }} variant="body1">Description: {product.description}</Typography>
                    <Typography sx={{ mb: 2 }} variant="body1">Charge: <b>{getBalanceProduct(product.chargeto).label}</b></Typography>
                    {product.coach_id > 0 && product.coach && <Typography variant="body1">Coach: <b>{product.coach.name}</b></Typography>}
                </Paper>}
                {product && <TextField margin="normal" type="number" name="count" onChange={handleCountChange} value={count} required fullWidth id="count" label="Minutes"
                    error={fieldErrors && fieldErrors.count ? true : false}
                    helperText={fieldErrors && fieldErrors?.count}
                />}
                {product && <TextField margin="normal" type="number" name="amount" onChange={handlePriceChange} value={price} required fullWidth id="amount" label="Charge Amount"
                    error={fieldErrors && fieldErrors.amount ? true : false}
                    helperText={fieldErrors && fieldErrors?.amount}
                />}
                {product && <TextField margin="normal" type="text" name="note" onChange={handleNoteChange} value={note} fullWidth multiline rows={2} id="note" label="Note"
                    error={fieldErrors && fieldErrors.note ? true : false}
                    helperText={fieldErrors && fieldErrors?.note}
                />}
                {product && <TextField margin="normal" type="date" name="date" onChange={(e)=>handleDateChange(e.target.value)} value={date} fullWidth id="date" label="Date"
                    error={fieldErrors && fieldErrors.date ? true : false}
                    helperText={fieldErrors && fieldErrors?.date}
                    InputLabelProps={{ shrink: true }} 
                />}

                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >{props.order ? "Modify" : "Charge"} </Button>
                <Button type="button" fullWidth variant="outlined" onClick={() => { props.onClose && props.onClose(false) }} sx={{ mb: 2 }} > Cancel </Button>
            </Box>
        </Box>
    </Container></>
}

export default Charge