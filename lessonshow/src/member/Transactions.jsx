import { useEffect, useState } from "react"
import apis from "../api"
import { apiResult, getUserSession } from "../Utils/Common"
import { useParams } from "react-router";
import { Box, Grid, Paper, Stack, Alert, Typography, Pagination } from "@mui/material"
import { getBalanceProduct } from "../Utils/balance.config";
const Transactions = () => {
    const [transactions, setTransactions] = useState()
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [balance, setBalance] = useState()
    const [error, setError] = useState()
    getUserSession(apis)
    const params = useParams()
    const loadTransactions = (page, pagesize, countdata) => {
        apis.loadTransactions(page, pagesize, countdata, params.id ? params.id : 0).then(ret => {
            apiResult(ret, data => {
                countdata === 1 && setTotal(data.total)
                setTransactions(data.data)
            }, setError)
        })
    }
    useEffect(() => {
        loadTransactions(currentPage-1, pageSize, 1)
        apis.loadBalance().then(ret => {
            apiResult(ret, data => {
                setBalance(data)
            }, setError)
        })
    }, [])
    const handleChangePage = (event,page) => {
        setCurrentPage(page)
        loadTransactions(page-1, pageSize, 0)
    }
    // const handleChangeRowsPerPage = (event) => {
    //     setCurrentPage(0)
    //     setPageSize(parseInt(event.target.value, 10))
    //     loadTransactions(0,parseInt(event.target.value, 10),0)
    // }

    return (
        <Box sx={{ mt: 4, maxWidht: '600px' }}>
            {error && <Alert severity="error">{error}</Alert>}
            {balance && balance.length > 0 ? <Paper sx={{ p: 2, m: 2, color: '#fff', background: '#059d' }}>
                <Typography sx={{ flex: '1 1 100%', mb: 1 }} component="div" variant="h6" >My balance</Typography>
                <Stack direction={{ xs: "column", sm: 'row' }}>
                    {balance.map((b, i) => {
                        return <Box sx={{ flex: '1 1 50%', p: 2 }}>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }} >$ {b.balance}</Typography>
                            <Typography component="div" sx={{ color: '#fff8' }}>{getBalanceProduct(b.type).label}</Typography>
                        </Box>
                    })}
                </Stack>
            </Paper> : <Paper sx={{ p: 2, m: 2, color: '#fff', background: '#059d' }}>
                <Typography sx={{ flex: '1 1 100%', mb: 1 }} component="div" variant="h6" >My balance</Typography>
                <Stack direction={{ xs: "column", sm: 'row' }}>
                    <Box sx={{ flex: '1 1 50%', p: 2 }}>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }} >$ 0.00</Typography>
                        <Typography component="div" sx={{ color: '#fff8' }}>Private class balance</Typography>
                    </Box>
                </Stack>
            </Paper>}

            {transactions && <Box>
                {transactions.map((t, i) => {
                    let color = '#ff5722af'
                    if (t.action === 'recharge') color = "#3c3"
                    else if (t.action === 'refund') color = "#288"

                    return <>
                        <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 1, ml: { xs: 2, sm: 2 }, mr: { xs: 2, sm: 2 } }}>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    <Typography sx={{ flex: '1 1 100%', mb: 1, color: '#0005' }} component="div" variant="body2" >{('#' + t.id) + " " + (t.member && t.member.name ? t.member.name : '')}</Typography>
                                    <Typography component="div" variant="body2" sx={{ mt: '2px', mb: '2px' }}>{t.user_order ? t.user_order.product_name : getBalanceProduct(t.user_balance.type).label}</Typography>
                                    {t.user_order && t.user_order.count != 0 && <Typography component="div" variant="body2" >{t.user_order.count} minutes</Typography>}
                                    {t.note && <Typography component="div" variant="body2" sx={{ color: '#0005' }}>{t.note}</Typography>}
                                </Grid>
                                <Grid item xs={3} >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Typography sx={{ color: '#0005', mb: 1 }} component="div" variant="body2" >{t.user_order ? t.user_order.order_date.substring(0, 10) : new Date(t.create_time).toLocaleDateString()}</Typography>
                                        <Typography component="div" variant="body1" sx={{ fontWeight: 'bold' }}>${t.amount}</Typography>
                                        <Typography component="div" variant="body2" sx={{ color: color }} >{t.action}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                        </Paper>
                    </>
                })}
                {total > 2 && <Pagination
                    component="div"
                    count={Math.round(total/pageSize) + (total%pageSize === 0?0:1)}
                    page={currentPage}
                    onChange={handleChangePage} 
                    sx={{mt:2}}             
                    //rowsPerPage={pageSize}
                    //onRowsPerPageChange={handleChangeRowsPerPage}
                />}
                {total == 0 && <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 1, ml: { xs: 2, sm: 2 }, mr: { xs: 2, sm: 2 } }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src="/nodata.png" />
                    </Box>

                </Paper>}
            </Box>}
        </Box>
    )
}
export default Transactions