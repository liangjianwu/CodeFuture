
import { Delete, DeleteOutline, Remove } from "@mui/icons-material";
import { Box, Alert, Typography, Button, Chip, Snackbar, Backdrop, IconButton, Stack } from "@mui/material";
import {useEffect, useState} from 'react';
import apis from "../../api";
import MyTable from "../../Component/MyTable";
import { apiResult, getUserSession } from "../../Utils/Common";
import { getBalanceProduct } from "./config";
import QuickOrder from "./fragement/QuickOrder";
import QuickOrderOptButton from "./fragement/QuickOrderOptButton";

const BatCharge = () => {
    const [error,setError] = useState()
    const [customers,setCustomers] = useState([])
    const [products,setProducts] = useState([])
    const [orders,setOrders] = useState([])
    const [submitting,setSubmitting] = useState(false)
    const [totalAmount,setTotalAmount] = useState(0)
    const [totalMinutes,setTotalMinutes] = useState(0)
    const session = getUserSession(apis)
    useEffect(()=>{
        apis.loadProducts(0,100,0).then(ret=>{
            apiResult(ret,data=>{
                setProducts(data.data)
            },setError)
        })
        apis.loadMembers(0,1000,0).then(ret=>{
            apiResult(ret,data=>{
                setCustomers(data.data)
            },setError)
        })
    },[])
    const handleAddOrder = (order)=>{
        let balance = null
        order.customer.user_balances.map(b=>{
            if(b.type === order.product.chargeto) {
                balance = b
            }
        })
        const neworder = {
            customer_id:order.customer.id,
            name:order.customer.name,
            chargeto:getBalanceProduct(order.product.chargeto).label,
            balance:balance != null?balance.balance:0,
            product_id:order.product.id,
            product_name:order.product.name,
            price:order.product.price,
            count:order.count,
            amount:(order.count*1.0/order.product.minutes * order.product.price).toFixed(2),
            date:order.date,
            peoples:order.peoples,
            note:order.note}
        setOrders([neworder,...orders])
        setTotalAmount(totalAmount + Number(neworder.amount))
        setTotalMinutes(totalMinutes + Number(neworder.count/(neworder.peoples>0?neworder.peoples:1)))
    }

    const handleRemoveOrder = (id,idx) => {
        let oo = [...orders]
        let o = oo.splice(idx,1)
        setOrders(oo)
        if(o.length == 1) {
            setTotalAmount(totalAmount - Number(o[0].amount))
            setTotalMinutes(totalMinutes - Number(o[0].count/(o[0].peoples>0?o[0].peoples:1)))
        }
    }
    const charge = async (index)=>{
        const order = orders[index]
        if(order.result) return
        let ret = await apis.bcharge({transaction_id:0,customers:[order.customer_id],product_id:order.product_id,date:order.date,amount:order.amount,count:order.count,peoples:order.peoples,note:order.note,type:0})
        apiResult(ret,data=>{                
            order.result = 'Success'
            setOrders([...orders.slice(0,index),order,...orders.slice(index+1)])
        },error=>{
            order.result = error
            setOrders([...orders.slice(0,index),order,...orders.slice(index+1)])
        })
        if(index+1 < orders.length) {
            await charge(index+1)
        }else {
            setSubmitting(false)
        }
    }
    const handleSubmit = async ()=> {
        if(!window.confirm("Are you sure to charge the members?")) return
        if(orders.length>0) {
            setSubmitting(true)
            await charge(0)
        }        
        // orders.map( async (order,index)=>{
        //     if(order.result) return
        //     let ret = await apis.bcharge({customers:[order.customer_id],product_id:order.product_id,date:order.date,amount:order.amount,count:order.count,note:order.note,type:0})
        //     apiResult(ret,data=>{                
        //         order.result = 'finished'
        //         setOrders([...orders.slice(0,index),order,...orders.slice(index+1)])
        //     },error=>{
        //         order.result = error
        //         setOrders([...orders.slice(0,index),order,...orders.slice(index+1)])
        //     })
        // })
    }
    const handleClear = () =>{
        setOrders([])
        setTotalAmount(0)
        setTotalMinutes(0)
    }
    const OrderHeader = [{name:'name',showName:'Member'},
        {name:'chargeto',showName:'Charge Balance'},
        {name:'balance',showName:'Balance',func:(v,idx,row)=>{
            if(Number(row['balance'])<Number(row['amount'])) {
                return <span style={{color:'red'}}>${row['balance']}</span>
            }else {
                return <span style={{color:'green'}}>${row['balance']}</span>
            }
        }},
        {name:'product_name',showName:'Product'},
        {name:'price',showName:'Price'},
        {name:'count',showName:'Minutes'},
        {name:'amount',showName:"Charge",func:(v,idx,row)=>{
            if(Number(row['balance'])<Number(row['amount'])) {
                return <span style={{color:'red'}}>${row['amount']}</span>
            }else {
                return <span style={{color:'green'}}>${row['amount']}</span>
            }
        }},
        {name:'date',showName:'Date'},
        {name:'peoples',showName:'Members'},
        {name:'note',showName:'Note'},
        {name:'result',showName:'Result',func:(v,idx,row)=>{
            return <span style={{color:'green'}}>{v}</span>
        }}]
    return <Box>
        {customers && products && <QuickOrder customers={customers} products={products} onAdd={handleAddOrder}/>}
        {orders.length>0&&<Box sx={{marginTop:2,marginBottom:2}}><MyTable rows={orders}
                totalRow={orders.length}
                headers={OrderHeader}
                checkbox={false}
                showPageination = {false}
                rowsPerPage={orders.length}
                OpentionComponent={(id, idx) => { return  !orders[idx].result ?<IconButton                     
                    onClick={()=>handleRemoveOrder(id,idx)}                    
                    id={id} index={idx}><DeleteOutline /></IconButton>:<></> }}                
                />
        </Box>}
        {orders.length >0 &&<Stack direction="row">
        <Typography variant="body1" sx={{mr:2}}>Total amount: <b>${totalAmount}</b></Typography>
        <Typography variant="body1" sx={{mr:2}}>Total minutes: <b>{totalMinutes}</b></Typography>
        <Typography variant="body1" sx={{flex:'1 1 10%'}}></Typography>
        <Button variant="outlined" sx={{mr:2}} onClick={handleClear}>Clear All</Button>
        <Button variant="contained" disabled={submitting} onClick={handleSubmit}>Charge</Button>
        </Stack>}
        
    </Box>
}

export default BatCharge