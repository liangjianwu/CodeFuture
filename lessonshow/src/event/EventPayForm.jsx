import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import apis from '../api';
import { apiResult, getUserSession } from '../Utils/Common';
import { ElementsConsumer, CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';

const stripePromise = loadStripe('pk_test_51LXUrYARfFg7JtJjdbtUnWo662JbQ8hQA763zQtOe7EGrL8MnNwGDb8dbKX24t99NPnKTJ6YcXzhJ4QzEZCo2y6b00avV0TedV');

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            iconColor: '#c4f0ff',
            color: '#32325d',
            fontWeight: '500',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
                color: '#fce883',
            },
            '::placeholder': {
                color: '#9B9B9B',
            },
        },
        invalid: {
            iconColor: '#fa755a',
            color: '#fa755a',
        },
    },
};

const EventCardSetupForm = (props) => {
    let { applyid,applycode,token, time, } = props
    const [secret, setSecret] = useState()
    const [amount, setAmount] = useState()
    //const [token,setToken] = useState()
    const [tokenTime, setTokenTime] = useState()
    const [error, setError] = useState()
    const [submitting, setSubmitting] = useState(false)
    const stripe = useStripe();
    const elements = useElements();
    getUserSession(apis)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError()
        if (!stripe || !elements || submitting) {
            setError('Parameters error')
            return;
        }
        setSubmitting(true)
        let result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "https://axisfencingclub.com/memberapi/event/paycallback?applyid="+applyid+"&token="+token+"&time="+time
            }
        })
        setSubmitting(false)
        if (result.error) {                //console.log(result.error)
            setError(result.error.type + ":" + result.error.message)
            return
        }
        //let current_payment_method = result.setupIntent.payment_method
        // apis.payEvent({ payment_method:current_payment_method,amount:amount,}).then(ret => {

        // }).catch(error => {
        //     setError(error.message)
        // })
    }
    return <Box>        
        <PaymentElement />
        {error && <Alert severity='error' onClose={()=>setError()}>{error}</Alert>}
        <Button fullWidth variant='contained' disabled={submitting} sx={{mt:2,mb:2}} onClick={handleSubmit}>Pay</Button>
    </Box>
}
const EventPayForm = (props) => {
    const { applyid, applycode } = props
    const [secret, setSecret] = useState()
    const [amount, setAmount] = useState()
    const [token, setToken] = useState()
    const [tokenTime, setTokenTime] = useState()
    const [error, setError] = useState()
    let initPage = false
    useEffect(() => {
        if (!secret && !initPage) {
            initPage = true
            apis.setupPay(applyid, applycode).then(ret => {
                apiResult(ret, data => {
                    setSecret(data.secret)
                    setAmount(data.amount)
                    setToken(data.token)
                    setTokenTime(data.time)
                }, setError)
            })
        }
    }, [applyid])
    return <>
        <Typography sx={{mb:2}} variant='body1'>You need to pay event fee: <span style={{ fontWeight: 'bold' }}>CAD ${amount}</span></Typography>
        <Typography sx={{mb:2,color:'#059c'}} variant='body1'>Payment services and credit card forms are provided by third-party professional payment service company (<a href="https://www.stripe.com" target="_blank" >Stripe</a>). We will not keep any credit card information.</Typography>
        
        {secret ? <Elements stripe={stripePromise} options={{ clientSecret: secret }}>
            

                <EventCardSetupForm applyid={applyid} applycode={applycode} token={token} time={tokenTime} />

        </Elements> : <CircularProgress />}
    </>
}

export default EventPayForm