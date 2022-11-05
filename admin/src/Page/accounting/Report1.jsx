import { useEffect } from "react"
import { useState } from "react"
import apis from "../../api"
import { useNavigate } from "react-router";
import { apiResult, formToJson, getCurrentMonth01, getUserSession } from "../../Utils/Common"
import { Paper,Toolbar, Grid,  FormControl,  Alert, TextField, Button, Box, } from '@mui/material';
import MyTable from "../../Component/MyTable";
import { RightDrawer, Title } from "../../Component/MuiEx";
import TransactionOptButton from "./fragement/TransactionOptButton copy";
import Refund from "./fragement/Refund1";
import EditTransaction from "./fragement/EditTransaction";
import { useRef } from "react";
const Report = () => {
    const [logs,setLogs] = useState([])    
    const [rechargeFamilies,setRechargeFamilies] = useState(0)
    const [recharge,setRecharge] = useState(0)
    const [charged,setCharged] = useState(0)
    const [error, setError] = useState()
    const [rightDrawer,setRightDrawer] = useState()
    const navigate = useNavigate()
    const searchField = useRef({from:getCurrentMonth01(),to:new Date().toISOString().split('T')[0]})
    getUserSession(apis)
    const handleOrder = (item)=>{
        const neworder = orderField.order == 'desc'?'asc':'desc'
        setOrderField({...orderField,name:item.name,order:neworder})
        loadData(searchField.current.from,searchField.current.to,item.name,neworder)
    }
    const [orderField,setOrderField] = useState({fields:['parent','order_date'],name:'order_date',order:'desc'})

    useEffect(()=>{
        loadData(searchField.current.from,searchField.current.to)
    },[])
    const loadData = (from,to,orderfield,order)=>{
        searchField.current.from = from
        searchField.current.to = to
        apis.getAccountingReport(from,to,orderfield,order).then(ret=>{
            apiResult(ret,data=>{
                setLogs(data.logs)
                if(!orderfield && !order ) {                    
                    setRecharge(data.recharged)
                    setRechargeFamilies(data.rechargedFamilies)
                    setCharged(data.charged)
                }
            },setError)
        })
    }
    const tableHeader = [
        {name:'id',showName:'ID'},
        {name:'order_date',showName:'Date',func:(v,idx,row)=>{            
            return v.substring(0,10)
        }},
        {name:'parent',showName:'Family',func:(v,idx,row)=>{
            return <div style={{cursor:'pointer'}} onClick={()=>{
                window.open('/accounting/orders/'+row.user_id+'/0','_axis_fencing_club_order')
            }}>{row.name}</div>
        }},                        
        {name:'amount',showName:'Before tax',func:(v,idx,row)=>{
            return "$" + (Number(row.amount)/1.13).toFixed(2)
        }},
        {name:'amount',showName:'Amount'},
        {name:'invoice',showName:'Invoice'},
        {name:'note',showName:'Note'},
        
    ]

    const handleSubmit = (event)=>{
        setError()
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postdata = formToJson(data)
        loadData(postdata.from,postdata.to)
    }
    const handleRefund = (id, idx) => {
        setError()
        setRightDrawer(<Refund item={logs[idx]} onClose={(ret) => { ret && loadData(searchField.current.from,searchField.current.to); setRightDrawer() }} />)
    }
    const handleTransactionHistory = (id, idx) => {    
        navigate('/accounting/orders/'+logs[idx].user_id+'/0')
    }  
    const handleRightDrawer = () => {
        setRightDrawer(false)
    }  
    // const showChargeForm = (products,order) => {
    //     setRightDrawer(<Charge products={products} customerid={order.member_id} order={order} onClose={(ret) => { setRightDrawer();ret && loadTransactions(0, rowsPerPage, 1,orderField.name,orderField.order) }} />)
    // }
    const handleEdit = (id,idx)=> {
        const order = logs[idx]
        setRightDrawer(<EditTransaction transaction={order} onClose={(ret) => { 
            setRightDrawer(); 
            if(ret) {
                const tt = [...logs]
                tt[idx] = {...tt[idx],...ret}               
                setLogs(tt)
            }
        }}/>)
    }
    return <>
        <Paper sx={{ p: 2, mb: 2 }} component="form" onSubmit={handleSubmit}>
            <Toolbar style={{ paddingLeft: 2 }}>
                <FormControl sx={{ width: '200px', mr: 2 }}>
                    <TextField margin="normal" sx={{ mt: "8px" }} type="date" name="from" defaultValue={getCurrentMonth01()} id="from" label="From"
                        InputLabelProps={{ shrink: true }} />
                </FormControl>
                <FormControl sx={{ width: '200px', mr: 2 }}>
                    <TextField margin="normal" type="date" sx={{ mt: "8px" }} name="to" defaultValue={new Date().toISOString().split('T')[0]} id="to" label="To"
                        InputLabelProps={{ shrink: true }} />
                </FormControl>
                <Button variant='contained' type="submit">Go</Button>
                {error && <Alert severity="error">{error}</Alert>}
            </Toolbar>
        </Paper>
        <Title>Summary</Title>
        <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container sx={{p:2}}>
                
                <Grid xs={2}>Recharged</Grid><Grid xs={2} sx={{fontWeight:'bold'}}>${recharge}</Grid>
                <Grid xs={2}>Recharged families</Grid><Grid xs={2} sx={{fontWeight:'bold'}}>{rechargeFamilies}</Grid>                
                <Grid xs={2}>Charged</Grid><Grid xs={2} sx={{fontWeight:'bold'}}>${charged}</Grid>                
                {/* <Grid xs={2}>Active families</Grid><Grid xs={2} sx={{fontWeight:'bold'}}>{activeFamilies}</Grid>
                <Grid xs={2}>Active members</Grid><Grid xs={2} sx={{fontWeight:'bold'}}>{activeMembers}</Grid>
                <Grid xs={2}>Total balance</Grid><Grid xs={2} sx={{fontWeight:'bold'}}>${balance}</Grid> */}
            </Grid>
        </Paper>
        <Title>Recharge records</Title>
        <MyTable 
            rows={logs}
            totalRow = {logs.length}
            order={orderField}
            onOrder={handleOrder}
            showPageination = {false}
            checkbox={false}
            headers = {tableHeader}
            OpentionComponent={(id, idx) => {
                    return <TransactionOptButton
                        onTransactionHistory={(id, idx) => { handleTransactionHistory(id, idx) }}                                                
                        onEdit={(id, idx) => handleEdit(id, idx)}
                        onRefund={(id, idx) => handleRefund(id, idx)}
                        id={id} index={idx} />
                }}
        />
        <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer ? true : false}>
                {rightDrawer}
            </RightDrawer>
    </>
}
export default Report