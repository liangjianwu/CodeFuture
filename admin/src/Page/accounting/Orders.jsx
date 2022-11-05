import MyTable from "../../Component/MyTable"
import { MenuItem, InputLabel,Select,TextField,FormControl, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop, Chip, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, formToJson, getCurrentMonth01, getUserSession, sessionGet, sessionSet } from "../../Utils/Common";
import apis from "../../api";
import { MemberLevel, MemberStatus, RightDrawer, SearchBar } from "../../Component/MuiEx";
import TransactionOptButton from "./fragement/TransactionOptButton copy";
import Refund from "./fragement/Refund";
import { useNavigate, useParams } from "react-router";
import { getBalanceProduct } from "./config";
import Charge from "./fragement/Charge";
import EditTransaction from "./fragement/EditTransaction";

const Orders = (props) => {
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [coaches,setCoaches] = useState()
    const [products,setProducts] = useState()
    const [transactions, setTransactions] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [title, setTitle] = useState()
    const [error, setError] = useState()
    const [ fields,setFields] = useState({coach:0,product:0,from:getCurrentMonth01(),to:new Date().toISOString().substring(0,10)})
    const [rightDrawer, setRightDrawer] = useState()   //open or close right drawer
    const [autoCloseRightDrawer, setAutoCloseRightDrawer] = useState(true)
    const params = useParams()
    const session = getUserSession(apis)
    const navigate = useNavigate()

    const handleOrder = (item) => {
        const neworder = orderField.order == 'desc' ? 'asc' : 'desc'
        setOrderField({ ...orderField, name: item.name, order: neworder })
        loadTransactions(0, rowsPerPage, 0, item.name, neworder)
    }
    const [orderField, setOrderField] = useState({ fields: ['id', 'create_time', 'parent', 'name'], name: 'id', order: 'desc' })
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadTransactions = (page, pagesize, countData, orderfield, order) => {
        //setLoading(true)
        const fid = params.id ? params.id : 0
        const kid = params.kid ? params.kid : 0
        apis.loadTransactions(page, pagesize, countData, fid, kid, orderfield ? orderfield : orderField.name, order ? order : orderfield.order,fields.coach,fields.product,fields.from,fields.to).then(ret => {
            //setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                setTransactions(data.data)
                if (data.data.length > 0) {
                    setTitle(kid > 0 ? (data.data[0].parent + " (" + data.data[0].name + ")") : (fid > 0 ? data.data[0].parent : "all family"))
                }
                setCurrentPage(page)
            }, setError)
        })
    }
    const loadCoaches = () => {
        apis.loadCoaches().then(ret => {
            apiResult(ret, (data) => {
                setCoaches(data)
            }, setError)
        })
    }
    const loadProducts = () => {     
        apis.loadProducts(0,100,0).then(ret => {            
            apiResult(ret, (data) => {                
                setProducts(data.data)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadTransactions(0, rowsPerPage, 1, 'id', 'desc')
        loadCoaches()
        loadProducts()
    }, [params])


    const handleRightDrawer = () => {
        autoCloseRightDrawer && setRightDrawer(false)
    }

    const handleChangePage = (page, rowsperpage) => {
        loadTransactions(page, rowsperpage, 0, orderField.name, orderField.order)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        setError()
        loadTransactions(0, rowsperpage, 0, orderField.name, orderField.order)
    }
    const handleRefund = (id, idx) => {
        setError()
        setRightDrawer(<Refund item={transactions[idx]} onClose={(ret) => { ret && loadTransactions(currentPage, rowsPerPage, 0, orderField.name, orderField.order); setRightDrawer() }} />)
    }
    const handleTransactionHistory = (id, idx) => {
        let cid = transactions[idx].member_id
        navigate('/accounting/orders/' + transactions[idx].user_id + '/0')
    }
    const handleKidTransactionHistory = (id, idx) => {
        let cid = transactions[idx].member_id
        navigate('/accounting/orders/' + transactions[idx].user_id + '/' + cid)
    }
    // const showChargeForm = (products,order) => {
    //     setRightDrawer(<Charge products={products} customerid={order.member_id} order={order} onClose={(ret) => { setRightDrawer();ret && loadTransactions(0, rowsPerPage, 1,orderField.name,orderField.order) }} />)
    // }
    const handleEdit = (id, idx) => {
        const order = transactions[idx]
        setRightDrawer(<EditTransaction transaction={order} onClose={(ret) => {
            setRightDrawer();
            if (ret) {
                const tt = [...transactions]
                tt[idx] = { ...tt[idx], ...ret }
                if (ret.order_date && tt[idx].order) {
                    tt[idx].order.order_date = ret.order_date
                }
                if (ret.peoples && tt[idx].order) {
                    tt[idx].order.peoples = ret.peoples
                }
                setTransactions(tt)
            }
        }} />)
    }
    // const handleEdit = (id, idx) => {
    //     const order = transactions[idx]
    //     if(order.subject !== 'charge') {
    //         alert("You can't edit this order")
    //         return
    //     }
    //     let products = sessionGet('products')
    //     if (!products) {
    //         setLoading(true)
    //         apis.loadProducts(0, 100, 0).then(ret => {
    //             setLoading(false)
    //             apiResult(ret, (data) => {
    //                 products = data.data
    //                 sessionSet('products', products)
    //                 showChargeForm(products,order)
    //             }, setError)
    //         })
    //     } else {
    //         showChargeForm(products,order)
    //     }
    // }
    // const handleCancelTransaction = (id,idx)=>{
    //     const order = transactions[idx]        
    //     if(window.confirm("Are you sure to cancel the transaction?")) {
    //         apis.cancelTransaction(order.id).then(ret=>{
    //             apiResult(ret,(data)=>{
    //                 loadTransactions(currentPage, rowsPerPage, 1,orderField.name,orderField.order)
    //             },setError)
    //         })
    //     }
    // }
    const handleChange = (key,v) =>{        
        setFields({...fields,[key]:v})
    }
    const handleGo = ()=>{
        loadTransactions(0,rowsPerPage,1,orderField.name,orderField.order)
    }
    const TransactionTableHeader = [
        { name: 'id', showName: 'No.' },
        {
            name: 'create_time', showName: 'Date', func: (v, idx, row) => {
                return <span title={new Date(v).toLocaleDateString()}>{row.order ? row.order.order_date.substring(0, 10) : ''}</span>
            }
        },
        {
            name: 'parent', showName: 'Family', func: (v, idx, row) => {
                return <div style={{ cursor: 'pointer' }} onClick={() => {
                    window.open('/accounting/orders/' + row.user_id + '/0', '_axis_fencing_club_order')
                }}>{v}</div>
            }
        },
        // { name: 'balancetype', showName: 'Charge/Recharge',func:(v)=>{
        //     return getBalanceProduct(v).label
        // } },
        {
            name: 'name', showName: 'Member', func: (v, idx, row) => {
                if (row.member_id > 0) {
                    const { icon, status } = MemberStatus(row.mstatus)
                    const { color, level ,label} = MemberLevel(row.level)
                    return <Chip size="small" variant="outlined" title={level+"-"+status} label={label+"-" + v} icon={icon} sx={{ m: "1px", cursor: 'pointer', border: "0px" }} onClick={() => {
                        window.open('/accounting/orders/' + row.user_id + '/' + row.member_id, '_axis_fencing_club_order')
                    }} />
                }
            }
        },
        {
            name: 'subject', showName: 'Subject', func: (v, idx, row) => {
                return v === 'refund' ? (v + " -> " + row.refer) : v
            }
        },
        {
            name: 'note', showName: 'Note', func: (v, idx, row) => {
                return <Stack direction="column">
                    <Typography variant="body2">{row.order?.product_name}</Typography>
                    {row.note && <Typography variant="body2" sx={{ color: "#0007" }}>{row.note}</Typography>}
                    {row.invoice && <Typography variant="body2" sx={{ color: "#0007" }}>Invoice: {row.invoice}</Typography>}
                </Stack>
            }
        },
        {name:'peoples',showName:'Members',func:(v,idx,row)=>{
            return row.order?row.order.peoples:1
        }},
        {
            name: 'note', showName: 'Minutes', func: (v, idx, row) => {
                return row.order ? (row.order.count) : ""
            }
        },
        
        { name: 'amount', showName: 'Amount' },
        // { name: 'note', showName: 'Note' },
        { name: 'balance', showName: 'Balance' },
    ]

    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <Paper sx={{ marginBottom: 2,p:1 }}>
                <Toolbar style={{ paddingLeft: 2 }}>
                    <Typography variant="h6" sx={{ml:1}} component="div" >Transactions of {title}</Typography>
                    <Typography sx={{ flex: '1 1 5%' }} variant="h6" component="div" ></Typography>
                    {/* <Button onClick={()=>{navigate('/accounting/transactions/'+params.id+'/'+(params.kid?params.kid:0))}}>switch</Button>               */}
                    <FormControl sx={{ width: '120px', mr: 2 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Select Coach</InputLabel>
                        <Select labelId="demo-simple-select-autowidth-label"
                            onChange={(e) => { handleChange('coach', e.target.value) }}
                            label="Select Coach"
                            value={fields.coach}
                        >
                            <MenuItem key={'-1'} value={0}>{"All"}</MenuItem>
                            {coaches && coaches.map((p, idx) => {
                                return <MenuItem key={idx} value={p.id}>{p.name}</MenuItem>
                            })}

                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '200px', mr: 2 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Select Product</InputLabel>
                        <Select labelId="demo-simple-select-autowidth-label"
                            onChange={(e) => { handleChange('product', e.target.value) }}
                            label="Select product"
                            value={fields.product}>
                            <MenuItem key={'-1'} value={0}>{"All"}</MenuItem>
                            {products && products.map((p, idx) => {
                                return <MenuItem key={idx} value={p.id}>{p.name}</MenuItem>
                            })}

                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '180px', mr: 2 }}>
                        <TextField margin="normal" disabled = {fields.coach == 0 && fields.product == 0} sx={{ mt: "8px" }} type="date" name="from" onChange={(e) => handleChange('from', e.target.value)} value={fields.from} id="from" label="From"
                            InputLabelProps={{ shrink: true }} />
                    </FormControl>
                    <FormControl sx={{ width: '180px', mr: 2 }}>
                        <TextField margin="normal" disabled = {fields.coach == 0 && fields.product == 0} type="date" sx={{ mt: "8px" }} name="to" onChange={(e) => handleChange('to', e.target.value)} value={fields.to} id="to" label="to"
                            InputLabelProps={{ shrink: true }} />
                    </FormControl>
                    <Button variant='contained' onClick={handleGo}>Go</Button>
                </Toolbar>
            </Paper>
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any transactions</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={transactions}
                totalRow={totalCount}
                headers={TransactionTableHeader}
                order={orderField}
                onOrder={(item) => { handleOrder(item) }}
                OpentionComponent={(id, idx) => {
                    return <TransactionOptButton
                        onTransactionHistory={(id, idx) => { params.id && handleTransactionHistory(id, idx) }}
                        onKidTransactionHistory={(id, idx) => { params.id && handleKidTransactionHistory(id, idx) }}
                        onEdit={(id, idx) => handleEdit(id, idx)}
                        onRefund={(id, idx) => handleRefund(id, idx)}
                        //onCancel={(id, idx) => handleCancelTransaction(id, idx)}                        
                        id={id} index={idx} />
                }}
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
export default Orders