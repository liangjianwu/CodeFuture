import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, AppBar, FormControlLabel, Switch, Slide, Dialog, InputLabel, Autocomplete, Select, Box, Grid, CardHeader, Avatar, CardContent, Card, FormControl, TextField, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop, IconButton, Chip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { apiResult, formToJson, getCurrentMonth01, getDatesInRange, getUserSession, sessionSet } from "../../Utils/Common";
import apis from "../../api";
import { MemberLevel, RightDrawer } from "../../Component/MuiEx";
import { useNavigate, useParams } from "react-router";
import ScheduleOptButton from "./fragement/ScheduleOptButton";
import DownMenuItem from "../member/fragement/DownMenuItem";
import EditSchedule from "./fragement/EditSchedule";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DailySchedule from "./fragement/DailySchedule";
import {DeleteScheduleDialog,EditScheduleDialog } from "./fragement/ModifyScheduleDialog";
import { Delete, DeleteOutline, EditOutlined } from "@mui/icons-material";

const Schedule = () => {
    const [loading, setLoading] = useState(false)
    const [rightDrawer, setRightDrawer] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [schedules, setSchedules] = useState([])
    const [showMember, setShowMember] = useState(["*"])
    const [dates, setDates] = useState([])
    const [members, setMembers] = useState([])
    const [products, setProducts] = useState([])
    const [coaches, setCoaches] = useState([])
    const [currentDate, setCurrentDate] = useState()
    const params = useParams()
    const [field, setField] = useState({ member_id: params.memberid, coach_id: params.coachid, from: getCurrentMonth01() })
    const [error, setError] = useState()
    const [timeStamp, setTimeStamp] = useState()
    const [deleteSchedule, setDeleteSchedule] = useState()
    const [editSchedule,setEditSchedule] = useState()
    const navigate = useNavigate()
    const [autoCloseRightDraw, setAutoCloseRightDraw] = useState(true)
    const session = getUserSession(apis)
    const weeks = ['S', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']
    const getMonthList = () => {
        let y = new Date().getFullYear()
        let m = new Date().getMonth() + 1

        let list = []
        for (let i = 0; i < 6; i++) {
            let nm = (m - 6 + i) < 0 ? (12 - m + 6 - i) : (m - 6 + i)
            nm = nm < 10 ? ('0' + nm) : nm
            let item = { date: y + '-' + nm + '-01', month: y + '-' + nm }
            list.push(item)
        }
        for (let i = 0; i < 6; i++) {
            let nm = ((m + i) > 12 ? (m + i - 12) : (m + i))
            nm = nm < 10 ? ('0' + nm) : nm
            let item = { date: y + '-' + nm + '-01', month: y + '-' + nm }
            list.push(item)
        }
        return list
    }
    const handleHintClose = () => {
        setHintMsg()
    }
    const inputRef = useRef()
    useEffect(() => {
        inputRef.current?.focus()
        if (inputRef.current) {
            inputRef.current.focus()
        }

    }, [timeStamp])
    const loadSchedule = (coachid, memberid, from) => {
        setLoading(true)
        apis.loadSchedules(members.length > 0 ? 0 : 1, coachid, memberid, from).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                products.length == 0 && setProducts(data.products)
                members.length == 0 && data.members.unshift({ id: 0, name: 'All' }) && setMembers(data.members)
                coaches.length == 0 && setCoaches(data.coaches)
                loadData(data)
            }, setError)
        })
    }
    // const getAllWeekDay = (wod, f, t) => {
    //     let dates = []
    //     let fdate = new Date(f)
    //     //console.log(fdate)
    //     let day = fdate.getDay()
    //     let date = wod >= day ? new Date(fdate.setDate(fdate.getDate() + wod - day)) : new Date(fdate.setDate(fdate.getDate() + (7 - (day - wod))))
    //     let tdate = new Date(t)
    //     while (date <= tdate) {
    //         let m = date.getMonth() + 1
    //         let d = date.getDate()
    //         dates.push(date.getFullYear() + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d))
    //         //dates.push(date.toISOString().substring(0,10))
    //         date = new Date(date.setDate(date.getDate() + 7))
    //     }
    //     return dates
    // }
    const loadData = (data) => {
        let s = {}
        setDates(getDatesInRange(data.from, data.to))
        data.schedules.map(d => {
            // let ff = !d.from || d.from == null || new Date(d.from) < new Date(data.from) ? data.from : d.from
            // let tt = !d.to || d.to == null || new Date(d.to) > new Date(data.to) ? data.to : d.to
            // let wdates = getAllWeekDay(d.wod, ff, tt)
            //for (let k = 0; k < wdates.length; k++) {
            let dd = { ...d }
            dd.members = [{ id: dd.id, mid: dd.member_id,schedule:dd }]
            if (s[dd.sdate]) {
                let insert = false
                for (let i = 0; i < s[dd.sdate].length; i++) {
                    let sd = s[dd.sdate][i]
                    if (sd.product_id == dd.product_id) {
                        if (sd.begintime == dd.begintime && sd.duration == dd.duration) {
                            let nmm = { id: dd.id, mid: dd.member_id,schedule:dd }
                            for (let jj = 0; jj < sd.members.length; jj++) {
                                if (sd.members[jj].mid == dd.member_id && dd.member_id > 0) {
                                    nmm.cover = true
                                    break
                                }
                            }
                            dd.member_id > 0 && sd.members.push(nmm)
                            insert = true
                            break
                        } else if ((sd.begintime <= dd.begintime && (Number(sd.begintime) + Number(sd.duration)) > dd.begintime) ||
                            (sd.begintime >= dd.begintime && (Number(dd.begintime) + Number(dd.duration)) > sd.begintime)) {
                            dd.cover = true
                            sd.cover = true
                        }
                    }
                }
                if (!insert) {
                    s[dd.sdate].push(dd)
                }
            } else {
                s[dd.sdate] = [dd]
            }
            //}
        })
        setSchedules(s)
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        if(!session) {
            window.location.href = '/account/coach'
        }
        loadSchedule(params.coachid, params.memberid)
    }, [])

    const handleAfterEdit = (idx, schedule) => {
        // let cc = [...schedules]
        // if (idx >= 0) {
        //     cc[idx] = schedule
        // } else {
        //     cc.push(schedule)
        // }
        // setSchedules(cc)
        setAutoCloseRightDraw(true)
        setRightDrawer(false)
        loadSchedule(field.coach_id, field.member_id, field.from)
    }
    const handleRightDrawer = () => {
        if (autoCloseRightDraw)
            setRightDrawer(false)
    }

    const handleAddSchedule = () => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditSchedule products={products} members={members} schedule={{ id: 0 }} onAfterEdit={(data) => { handleAfterEdit(-1, data) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleDelete = (lesson, idx) => {
        // window.confirm('Are you sure to delete the schedule') && apis.scheduleStatus(lesson.id, 0).then(ret => {
        //     apiResult(ret, data => {
        //         loadSchedule(field.coach_id, field.member_id, field.from)
        //     }, setError)
        // })        
        setDeleteSchedule({ ...lesson, type: 'member' })
    }
    const handleDeleteLesson = async (lesson) => {
        // if (window.confirm('Are you sure to delete the schedule')) {
        //     for (let i = 0; i < lesson.members.length; i++) {
        //         let m = lesson.members[i]
        //         await apis.scheduleStatus(m.id, 0)
        //     }
        //     loadSchedule(field.coach_id, field.member_id, field.from)
        // }        
        setDeleteSchedule({ ...lesson, type: 'plan' })
    }
    const handleDeleteSchedule = (option) => {        
        let data = { id: deleteSchedule.id, type:deleteSchedule.type, option: option}        
        apis.deleteSchedule(data).then(ret => {
            apiResult(ret, data => {
                loadSchedule(field.coach_id, field.member_id, field.from)
                setDeleteSchedule()
            }, setError)
        })
    }
    const handleEdit = (lesson, idx) => {
        // window.confirm('Are you sure to delete the schedule') && apis.scheduleStatus(lesson.id, 0).then(ret => {
        //     apiResult(ret, data => {
        //         loadSchedule(field.coach_id, field.member_id, field.from)
        //     }, setError)
        // })        
        setEditSchedule({ ...lesson, type: 'member' })
    }
    const handleEditLesson = async (lesson) => {
        // if (window.confirm('Are you sure to delete the schedule')) {
        //     for (let i = 0; i < lesson.members.length; i++) {
        //         let m = lesson.members[i]
        //         await apis.scheduleStatus(m.id, 0)
        //     }
        //     loadSchedule(field.coach_id, field.member_id, field.from)
        // }        
        setEditSchedule({ ...lesson, type: 'plan' })
    }
    const handleEditSchedule = (data) => {                
        apis.editSchedule(data).then(ret => {
            apiResult(ret, data => {
                loadSchedule(field.coach_id, field.member_id, field.from)
                setEditSchedule()
            }, (err)=>{alert(err)})
        })
    }
    const handleChange = (key, value) => {
        let tt = { ...field, [key]: value }
        setField(tt)
        loadSchedule(tt.coach_id, tt.member_id, tt.from)
    }
    // const handleGo = () => {
    //     loadSchedule(field.coach_id ? field.coach_id : 0, field.member_id ? field.member_id : 0, field.from ? field.from : undefined)
    // }
    const setTextInputRef = (element) => {
        inputRef.current = element;
    };    
    const OptionButton = session.isCoach?[]:[
        { text: "Add", icon: <AddIcon fontSize="small" />, onClick: handleAddSchedule },
    ]
    const getProductById = (id) => {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                return products[i]
            }
        }
        return undefined
    }
    const getMemberById = (id) => {
        for (let i = 0; i < members.length; i++) {
            if (members[i].id === id) {
                return members[i]
            }
        }
        return undefined
    }
    const getCoachById = (id) => {
        for (let i = 0; i < coaches.length; i++) {
            if (coaches[i].id === id) {
                return coaches[i]
            }
        }
        return undefined
    }

    const handleDateClick = (data) => {
        let coachs = {}
        data.schedule.map(lesson => {
            let coach = getCoachById(lesson.coach_id)
            lesson.cname = coach.name
            if (coachs["coach_" + coach.id]) {
                coachs["coach_" + coach.id].lessons.push(lesson)
            } else {
                coachs["coach_" + coach.id] = { coach: coach, lessons: [lesson] }
            }
        })
        data.schedule = coachs
        setCurrentDate(data)
    }
    const handleShowMember = (id)=>{

        if(id == '*') {
            setShowMember([id])
        }else if(id == undefined) {
            setShowMember([])
        }else {
            let i = showMember.indexOf(id)
            if(i>=0) {
                let ss = [...showMember]
                ss.splice(i,1)
                setShowMember(ss)
            }else {                
                setShowMember([...showMember,id])
            }        
        }
    }
    return (
        <Box sx={{p:1}}>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <Paper sx={{ marginBottom: 2, p:1 }}>
                <Toolbar style={{ paddingLeft: 2 }}>
                    <FormControl sx={{ width: '300px', mr: 2 }}>
                        <InputLabel id="demo-simple-select-autowidth-label2">Select Coach</InputLabel>
                        <Select labelId="demo-simple-select-autowidth-label2"
                            onChange={(e) => { handleChange('coach_id', e.target.value) }}
                            label="Select Coach"
                        >
                            <MenuItem key={'-1'} value={0}>{"All"}</MenuItem>
                            {coaches && coaches.map((p, idx) => {
                                return <MenuItem key={idx} value={p.id}>{p.name}</MenuItem>
                            })}

                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '300px', mr: 2 ,display:{xs:'none',sm:'flex'}}}>
                        <Autocomplete disablePortal id="customer-selector"
                            options={members}
                            autoComplete
                            autoHighlight
                            autoSelect
                            getOptionLabel={(option) => MemberLevel(option.level).label +"-" + option.name + "-" + option.id}
                            onChange={(_event, newitem) => { handleChange('member_id', newitem.id) }}
                            renderInput={(params) => <TextField {...params} label="Member" inputRef={setTextInputRef} />}
                            InputLabelProps={{ shrink: true }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: '300px', mr: 2 }}>
                        <InputLabel id="demo-simple-select-autowidth-label1">Select month</InputLabel>
                        <Select labelId="demo-simple-select-autowidth-label1"
                            onChange={(e) => { handleChange('from', e.target.value) }}
                            label="Select Coach" >
                            {getMonthList().map((p, idx) => {
                                return p.month && <MenuItem key={idx} value={p.date}>{p.month}</MenuItem>
                            })}

                        </Select>
                    </FormControl>
                    {/* <FormControl sx={{ width: '300px', mr: 2 }}>
                        <TextField margin="normal" sx={{ mt: "8px" }} type="date" name="from" onChange={(e) => { handleChange('from', e.target.value) }} id="from" label="After date" InputLabelProps={{ shrink: true }} />
                    </FormControl> */}


                    <Typography sx={{ flex: '1 1 20%' }} variant="h6" component="div" ></Typography>
                    <FormControlLabel sx={{display:{xs:'none',sm:'flex'}}}  control={<Switch defaultChecked={false} onChange={(e) => {
                        handleShowMember(e.target.checked?"*":undefined)
                    }} />} label="Member" />
                    {<Stack direction={{ xs: 'column', sm: 'row' }}>
                        {OptionButton.map((item, index) => {
                            return item.subItems ? <DownMenuItem key={index} icon={item.icon} onClick={item.onClick} items={item.subItems} text={item.text} /> :
                                <MenuItem key={index} onClick={item.onClick}>
                                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}<ListItemText>{item.text}</ListItemText>
                                </MenuItem>
                        })}
                    </Stack>}

                </Toolbar>
            </Paper>
            {schedules.length == 0 && <Alert severity={"info"}>Ops! There is not any data</Alert>}
            <Box>
                <Grid container spacing={1}>
                    {dates.map((item, index) => {
                        const data = schedules[item] ? schedules[item] : []
                        //console.log([item,new Date(item),new Date(item).getDay(),weeks]) 
                        return <Grid key={index} item xs={12} sm={4} md={12 / 7} >
                            <Card key={index}>
                                <CardHeader onClick={() => { handleDateClick({ date: item, schedule: data }) }} sx={{ padding: '5px !important', cursor: 'pointer', bgcolor: item.substring(0, 7) != field.from.substring(0, 7) ? '#0003' : '#059a', color: '#fff' }} title={item}
                                    avatar={<Box sx={{ bgcolor: '#fff',color: '#ff5722',width:25,height:25,p:"5px",borderRadius:"15px" }} size={"small"} fontSize={"small"} aria-label="recipe">{weeks[new Date(item + ' 12:00:00').getDay()]}</Box>} />
                                <CardContent sx={{ minHeight: 150, padding: '5px !important' }}>
                                    {data.map((lesson, index1) => {
                                        let p = getProductById(lesson.product_id)
                                        lesson.pname = p.name
                                        return <Paper key={index1} sx={{ p: 0.5, mb: '2px', bgcolor: lesson.cover ? '#f001' : (lesson.member_id==0?'#f7df88aa':'#0001') }} onClick={(e)=>{e.stopPropagation();handleShowMember(lesson.id);return false;}}>
                                            <Stack direction={'row'} title={p?.name}>
                                                <Typography variant="h6" color="text.secondary" sx={{fontSize:'10px',color:'#000',fontWeight:'bold',marginRight:'6px'}}>{Math.floor(lesson.begintime / 60) + ":" + (lesson.begintime % 60 < 10 ? ('0' + lesson.begintime % 60) : (lesson.begintime % 60))}~{Math.floor((lesson.begintime + lesson.duration) / 60) + ":" + ((lesson.begintime + lesson.duration) % 60 < 10 ? ('0' + (lesson.begintime + lesson.duration) % 60) : ((lesson.begintime + lesson.duration) % 60))}</Typography>
                                                <Typography title={p?.name} variant="h6" color="text.secondary" sx={{ fontSize:'10px',fontWeight: 'bold',overflow:'hidden',maxHeight:'12px', flex: '1 1 100%' }}>{p?.name}</Typography>                                                
                                                <Delete  sx={{ fontSize:'12px',color: '#0003', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson);return false; }} />
                                                <EditOutlined sx={{ fontSize:'12px', color: '#0003', cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); handleEditLesson(lesson);return false; }} />
                                            </Stack>
                                            {lesson.members.map(member => {
                                                let mm = getMemberById(member.mid)
                                                member.name = mm.name
                                                return (showMember.indexOf("*")>=0 || showMember.indexOf(lesson.id)>=0) && member.mid > 0 ? <Chip size={'small'} key={member.mid} color={member.cover ? 'error' : 'success'} variant={"outlined"} sx={{ p: 0,fontSize:'10px',height:'18px',lineHeight:'1' }} label={mm?.name} onClick={(e) => { e.stopPropagation();handleEdit(member.schedule, 0);return false; }}  onDelete={(e) => { e.stopPropagation();handleDelete(member, 0);return false; }} /> : null
                                            })}
                                            
                                        </Paper>
                                    })}
                                </CardContent>
                            </Card></Grid>
                    })}
                </Grid>

            </Box>
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
            <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer ? true : false}>
                {rightDrawer}
            </RightDrawer>
            {currentDate && <DailySchedule dateSchedule={currentDate} onClose={() => { setCurrentDate() }}></DailySchedule>}
            {deleteSchedule && <DeleteScheduleDialog schedule={deleteSchedule} onClose={() => { setDeleteSchedule() }} onSubmit={handleDeleteSchedule} />}
            {editSchedule && <EditScheduleDialog schedule={editSchedule} members={members} products={products} onClose={() => { setEditSchedule() }} onSubmit={handleEditSchedule} />}
        </Box>
    )
}
export default Schedule