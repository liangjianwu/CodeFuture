import { Box, Paper, Alert, Snackbar, Typography, Toolbar,Button,IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import apis from "../../api"
import { Title } from "../../Component/MuiEx"
import { apiResult, getCurrentMonth01, getUserSession } from "../../Utils/Common"
import Chart from "./fragement/Chart"
import CoachBar from "./fragement/CoachBar"
import {Add,HorizontalRule} from '@mui/icons-material';
const Report = () => {
    const [records, setRecords] = useState()
    const session = getUserSession(apis)
    const [error, setError] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [coaches, setCoaches] = useState([])
    const [condition, setCondition] = useState({ from: getCurrentMonth01(), to: new Date().toISOString().split('T')[0], coach: 0 })
    const [details,setDetails] = useState({})
    const [totalAll,setTotalAll] = useState(0)
    const [totalPrivate,setTotalPrivate] = useState(0)
    const loadCoaches = () => {
        apis.loadCoaches().then(ret => {
            apiResult(ret, (data) => {
                setCoaches(data)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadCoaches()
        loadCoachTime(0,getCurrentMonth01(),new Date().toISOString().split('T')[0])
    }, [])
    const loadCoachTime = (coach, from, to) => {
        apis.loadCoachRecord(coach, from, to).then(ret => {
            apiResult(ret, data => {
                let report = {}
                let tableData = []
                setCoaches(data.coaches)
                let tt = 0
                let tp = 0
                data.records.map(record => {
                    if(record.coach_id == 0) return
                    if (!report['coach_' + record.coach_id]) {
                        report['coach_' + record.coach_id] = {
                            month: Number(record.duration),
                            data: {
                                ['product_' + record.product_id]: {
                                    name: record.product.name,//getProductName(record.product_id, data.products),
                                    total: Number(record.duration),
                                    amount:Number(record.amount),
                                    data: [{
                                        date: new Date(record.order_date).toISOString().substring(0,10),
                                        duration: Number(record.duration),
                                        amount:Number(record.amount),
                                    }]
                                }
                            },
                            name: record.coach.name//getCoachName(record.coach_id, data.coaches)
                        }
                        tt += Number(record.duration)
                        tp +=  (Number(record.amount) != 0?Number(record.duration):0)
                    } else {
                        report['coach_' + record.coach_id].month += Number(record.duration)
                        if (!report['coach_' + record.coach_id].data['product_' + record.product_id]) {
                            report['coach_' + record.coach_id].data['product_' + record.product_id] = {
                                name: record.product.name,//getProductName(record.product_id, data.products),
                                total: Number(record.duration),
                                amount:Number(record.amount),
                                data: [{
                                    date: new Date(record.order_date).toISOString().substring(0,10),
                                    duration: Number(record.duration),                                    
                                }]
                            }
                            tt += Number(record.duration)
                            tp +=  (Number(record.amount) != 0?Number(record.duration):0)
                        } else {
                            report['coach_' + record.coach_id].data['product_' + record.product_id].total += Number(record.duration)
                            report['coach_' + record.coach_id].data['product_' + record.product_id].amount += Number(record.amount)
                            report['coach_' + record.coach_id].data['product_' + record.product_id].data.push({
                                date: new Date(record.order_date).toISOString().substring(0,10),
                                duration: Number(record.duration),                                
                            })
                            tt += Number(record.duration)
                            tp += (Number(record.amount) != 0?Number(record.duration):0)
                        }
                    }
                })                      
                setTotalAll(tt)
                setTotalPrivate(tp)
                setRecords(report)
            }, setError)
        })
    }
    const handleHintClose = () => {
        setHintMsg()
    }
    const handleLook = (fields) => {
        setCondition(fields)
        loadCoachTime(fields.coach, fields.from, fields.to)
    }
    const getDatesInRange = (startDate, endDate) => {
        const date = new Date(startDate);
        const dates = [];
        while (date <= new Date(endDate)) {            
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return dates;
    }
    const showHours = (m)=>{
        
        return (Math.floor(m/60)).toFixed(0) + 'h ' + m%60 + 'm'
    }
    return (
        <>
            <CoachBar coaches={coaches} onSubmit={handleLook} total={totalAll} totalPrivate = {totalPrivate}/>
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            {records && Object.keys(records).map(key => {
                let coach = records[key]
                return <Paper key={key} sx={{ p: 2,mt:1 }}>
                    <Toolbar sx={{ paddingLeft: '15px !important' }}>
                        <Title sx={{ flex: '1 1 100%' }}>{coach.name}</Title>
                        <Typography sx={{ color: 'green', width: '150px' }}>{showHours(coach.month)}</Typography>
                    </Toolbar>
                    {
                        Object.keys(coach.data).map(pkey => {
                            let product = coach.data[pkey]
                            let data = []
                            let dates = getDatesInRange(condition.from, condition.to)
                            dates.map(date => {
                                let d = { date: date.toISOString().substring(5,10), amount: 0 }
                                for (let i = 0; i < product.data.length; i++) {                                    
                                    if (new Date(product.data[i].date).toISOString().substring(5,10) == date.toISOString().substring(5,10)) {
                                        d.amount = product.data[i].duration
                                    }
                                }
                                data.push(d)
                            })
                            return <Box key={pkey}>
                                <Toolbar sx={{ paddingLeft: '15px !important', minHeight: '24px !important' ,cursor:'pointer'}} onClick={()=>{setDetails({...details,[coach.name+'-'+pkey]:!details[coach.name+'-'+pkey]})}}>
                                    <IconButton>
                                        {!details[coach.name+'-'+pkey]?<Add fontSize="small"/>:<HorizontalRule fontSize="small"/>}
                                    </IconButton>                                    
                                    <Typography variant="body2" sx={{ mt:1,flex: '1 1 100%' }}>{product.name}</Typography>
                                    <Typography variant="body2" sx={{ mt:1,width: '150px' }}>{showHours(product.total)}</Typography>
                                    <Typography variant="body2" sx={{ mt:1,width: '150px' }}>${Math.abs(product.amount)}</Typography>
                                    
                                </Toolbar>
                                {details[coach.name+'-'+pkey] && <Box sx={{ p: 2, display: 'flex',background:'#00000008', flexDirection: 'column', height: 240,}}>
                                    <Chart key={pkey} data={data} />
                                </Box>}
                            </Box>

                        })
                    }
                </Paper>
            })}

            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>

    )
}
export default Report