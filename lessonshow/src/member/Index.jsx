import { Box, Stack, Paper, Typography, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import apis from "../api"
import { getBalanceProduct } from "../Utils/balance.config"
import { apiResult, getUserSession } from "../Utils/Common"

const Index = () => {
    const [kids, setKids] = useState()
    const [balance, setBalance] = useState()
    const [error, setError] = useState()
    const session = getUserSession(apis)
    const navigate = useNavigate()
    let initPage = false
    useEffect(() => {
        if (!initPage) {
            initPage = true
        } else {
            return
        }
        if (!kids) {
            apis.loadKidsProfile().then(ret => {
                apiResult(ret, data => {
                    data.members.map(m => {
                        m.member_infos && m.member_infos.map(mi => {
                            m[mi.key] = mi.value
                        })
                        m.member_infos = null
                    })
                    setKids(data.members)
                }, setError)
            })
        }
        if (!balance) {
            apis.loadBalance().then(ret => {
                apiResult(ret, data => {
                    setBalance(data)
                })
            })
        }
    }, [])
    return <Box sx={{ mt: 4, maxWidht: '600px' }}>
        {/* <Box sx={{ m: 2, p: 4, maxWidht: '600px', display: 'flex', flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h4">
                Welcome!
            </Typography>           
        </Box> */}
        <Grid container spacing={2} sx={{ p: 2 }}>
            {/* <Grid item xs={12} sm={6} md={6}>
                <Paper sx={{ p: 2, maxWidht: '600px', display: 'flex',minHeight:'300px',maxHeight:'500px',overflow:'auto', flexDirection: "column", alignItems: "center" }}>
                                  
                </Paper>
            </Grid> */}
            <Grid item md={6} xs={12}>
                {balance && balance.length > 0 ? <Paper sx={{ p: 2, }} onClick={() => navigate('/member/transactions')}>
                    <Typography sx={{ flex: '1 1 100%', mb: 1 }} component="div" variant="h6" >My balance</Typography>
                    <Stack direction={{ xs: "column", sm: 'row' }}>
                        {balance.map((b, i) => {
                            return <Box sx={{ flex: '1 1 50%', p: 2 }}>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }} >$ {b.balance}</Typography>
                                <Typography component="div" sx={{ color: '#fff8' }}>{getBalanceProduct(b.type).label}</Typography>
                            </Box>
                        })}
                    </Stack>
                </Paper> : <Paper sx={{ p: 2, }} onClick={() => navigate('/member/transactions')}>
                    <Typography sx={{ flex: '1 1 100%', mb: 1 }} component="div" variant="h6" >My balance</Typography>
                    <Stack direction={{ xs: "column", sm: 'row' }}>
                        <Box sx={{ flex: '1 1 50%', p: 2 }}>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }} >$ 0.00</Typography>
                            <Typography component="div" >Private class balance</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={'row'}>
                    <Typography sx={{ flex: '1 1 100%', mb: 1 }} component="div" variant="h6" ></Typography>
                    <Typography sx={{ mb: 1 }} component="div" variant="body2" >View</Typography>
                    </Stack>
                </Paper>}

                {kids && <Paper sx={{ p: 2,mt:2 }} onClick={() => navigate('/member/kids')}>
                    <Typography sx={{ flex: '1 1 100%', mb: 1 }} component="div" variant="h6" >My Kids</Typography>
                    <Stack direction={{ xs: "column", sm: 'row' }}>
                        {kids.map((b, i) => {
                            return <Box sx={{ flex: '1 1 50%', p: 2 }}>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }} >{b.name}</Typography>
                                <Typography component="div">{"#" + b.id}</Typography>
                            </Box>
                        })}
                    </Stack>
                    <Stack direction={'row'}>
                    <Typography sx={{ flex: '1 1 100%', mb: 1 }} component="div" variant="h6" ></Typography>
                    <Typography sx={{ mb: 1 }} component="div" variant="body2" >View</Typography>
                    </Stack>
                </Paper>}

            </Grid>


            

        </Grid>



    </Box>
}
export default Index