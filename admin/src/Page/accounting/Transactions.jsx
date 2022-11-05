import MyTable from "../../Component/MyTable"
import { MenuItem, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, formToJson, getUserSession, sessionSet } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer, SearchBar } from "../../Component/MuiEx";
import TransactionOptButton from "./fragement/TransactionOptButton copy";
//import Refund from "./fragement/Refund";
import { useNavigate, useParams } from "react-router";
import { getBalanceProduct } from "./config";

const Transactions = (props) => {
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [transactions, setTransactions] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [title,setTitle] = useState()
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [error, setError] = useState()
    const [rightDrawer, setRightDrawer] = useState()   //open or close right drawer
    const [autoCloseRightDrawer, setAutoCloseRightDrawer] = useState(true)
    const params = useParams()
    const session = getUserSession(apis)
    const navigate = useNavigate()
    const handleOrder = (item)=>{
        const neworder = orderField.order == 'desc'?'asc':'desc'
        setOrderField({...orderField,name:item.name,order:neworder})
        loadTransactions(0,rowsPerPage,0,item.name,neworder)
    }
    const [orderField,setOrderField] = useState({fields:['id','parent'],name:'id',order:'desc'})
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadTransactions = (page, pagesize, countData,orderfield,order) => {
        //setLoading(true)
        const fid = params.id ? params.id : 0
        const kid = params.kid ? params.kid : 0
        apis.loadTransactions(page, pagesize, countData, fid,kid,orderfield,order).then(ret => {
            //setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                // data.data.map(d=>{
                //     d.chargeto = getBalanceProduct(d.balancetype).label
                // })
                if(data.data.length>0) {
                    setTitle(kid>0?(data.data[0].parent+" (" + data.data[0].name+")"):(fid>0?data.data[0].parent:"all family"))
                }
                setTransactions(data.data)
                setCurrentPage(page)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        // if (initPage) return
        // initPage = true
        loadTransactions(0, rowsPerPage, 1,'id','desc')
    }, [params])


    const handleRightDrawer = () => {
        autoCloseRightDrawer && setRightDrawer(false)
    }

    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadTransactions(page, rowsperpage, 0,orderField.name,orderField.order)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        setError()
        loadTransactions(0, rowsperpage, 0,orderField.name,orderField.order)
    }
   
    const TransactionTableHeader = [
        { name: 'id', showName: 'No.' },
        { name: 'parent', showName: 'Family',func:(v,idx,row)=>{
            return v + (row.name?(" ("+ row.name+")"):"")
        }  },
        { name: 'subject', showName: 'Subject',func:(v,idx,row)=>{
            return v === 'refund'?(v+" -> "+row.refer):v
        } }, 
        // { name: 'balancetype', showName: 'Charge/Recharge',func:(v)=>{
        //     return getBalanceProduct(v).label
        // } },
        { name: 'amount', showName: 'Amount' },
        { name: 'balance', showName: 'Balance' },
        { name: 'note', showName: 'Note' },
        { name: 'create_time', showName: 'Date' ,func:(v)=>{
            return new Date(v).toLocaleDateString()
        } },]

    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar style={{ paddingLeft: 2 }}>
                    <Typography sx={{ flex: '1 1 100%', ml: 2 }} variant="h6" component="div" >Transactions of {title} - V1</Typography>
                    <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div" ></Typography>      
                    {/* <Button onClick={()=>{navigate('/accounting/orders/'+params.id+'/'+(params.kid?params.kid:0))}}>switch</Button>               */}
                </Toolbar>
            </Paper>
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any transactions</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={transactions}
                order={orderField}
                onOrder={handleOrder}
                totalRow={totalCount}
                headers={TransactionTableHeader}
                // OpentionComponent={(id, idx) => { return <TransactionOptButton 
                //     onRefund={(id, idx) => handleRefund(id, idx)} 
                //     // onInvoice={(id, idx) => handleInvoice(id, idx)} 
                //     onTransactionHistory = {(id,idx)=>{params.id && handleTransactionHistory(id,idx)}}
                //     id={id} index={idx} /> }}
                rowsPerPage={rowsPerPage}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />}
            <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer ? true : false}>
                {rightDrawer}
            </RightDrawer>
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>

    )
}
export default Transactions