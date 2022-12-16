import { useEffect, useState, useRef } from "react"
import apis from "../api"
import { apiResult, getUserSession } from "../Utils/Common"
import { Box, Grid, Card, Button, CardHeader, Avatar, CardContent, Paper, Stack, Chip, Alert, Typography, Toolbar } from "@mui/material"

const MemberSchedule = () => {
    const schedules = useRef()
    const [dates, setDates] = useState()
    const [error, setError] = useState()
    const [week, setWeek] = useState(0)
    const weeks = ['S', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']
    getUserSession(apis)

    const getOneWeekDates = (dd) => {
        let now = dd ? new Date(dd) : new Date()
        let dates = []
        for (let i = 0; i < 7; i++) {
            let y = now.getFullYear()
            let m = now.getMonth() + 1
            let d = now.getDate()
            let w = now.getDay()
            let date = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d)
            dates.push({ date: date, wod: w, schedule: [] })
            now.setDate(now.getDate() + 1)
        }
        return dates
    }


    const loadSchedules = () => {
        apis.loadSchedule().then(ret => {
            apiResult(ret, data => {
                schedules.current = data
                setWeekSchedule(data)
                //setSchedules(data)
            }, setError)
        })
    }
    const setWeekSchedule = (schedules, dd) => {
        let dds = getOneWeekDates(dd)
        let s = {}
        schedules.map(d => {
            for (let i = 0; i < dds.length; i++) {
                if (dds[i].wod == d.wod && (!d.from || d.from == null || new Date(d.from) <= new Date(dds[i].date)) && (!d.to || d.to == null || new Date(d.to) >= new Date(dds[i].date))) {
                    dds[i].schedule.push(d)
                }
            }
            return true
        })
        setDates(dds)
    }
    useEffect(() => {
        loadSchedules()
    }, [])

    const handleWeek = (w) => {
        setWeek(w)
        let date = new Date()
        setWeekSchedule(schedules.current, date.setDate(date.getDate() + w * 7))
    }


    return <Box sx={{ p: 2, pt: { md: 4 } }}>
        <Stack direction={"row"} sx={{ mb: 2 }}>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 'bold', flex: '1 1 60%' }}>Kids schedule</Typography>
            {week > 0 && <Button variant="outlined" onClick={() => handleWeek((week - 1) >= 0 ? (week - 1) : 0)} >{"<"}</Button>}
            <Button variant="outlined" onClick={() => handleWeek(week + 1)} sx={{ ml: 2 }}>{">"}</Button>
        </Stack>
        {error && <Alert severity="error" onClose={() => { setError() }}>{error}</Alert>}
        <Grid container spacing={2}>
            {dates && dates.map((item, index) => {
                return <Grid item key={index} xs={12} sm={4} md={3} >
                    <Card key={index}>
                        <CardHeader sx={{ bgcolor: item.date == new Date().toISOString().substring(0, 10) ? '#059' : '#059a', color: '#fff' }} title={item.date}
                            avatar={<Avatar sx={{ bgcolor: '#fff', color: '#ff5722' }} size={"small"} fontSize={"small"} aria-label="recipe">{weeks[item.wod]}</Avatar>} />
                        <CardContent sx={{ minHeight: 150, padding: '5px !important' }}>
                            {item.schedule.length == 0 && <Box sx={{ p: 0.5, mt: 1, }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', flex: '1 1 100%' }}>no lesson</Typography>
                            </Box>}
                            {item.schedule.map((lesson, index1) => {
                                return <Box key={index1} sx={{ p: 0.5, mt: 1, }}>
                                    <Stack direction={'row'}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', flex: '1 1 100%' }}>{lesson?.product.name}</Typography>
                                        {/* <CancelOutlinedIcon fontSize={'small'} sx={{ mr: 1, color: '#0003', cursor: 'pointer' }} onClick={() => { handleDeleteLesson(lesson) }} /> */}
                                    </Stack>
                                    <Chip size={'small'} color={'success'} variant={"outlined"} sx={{ p: 0 }} label={lesson?.member.name} />
                                    <Typography variant="body2" color="text.secondary">{Math.floor(lesson.begintime / 60) + ":" + (lesson.begintime % 60 < 10 ? ('0' + lesson.begintime % 60) : (lesson.begintime % 60))}~{Math.floor((lesson.begintime + lesson.duration) / 60) + ":" + ((lesson.begintime + lesson.duration) % 60 < 10 ? ('0' + (lesson.begintime + lesson.duration) % 60) : ((lesson.begintime + lesson.duration) % 60))}</Typography>
                                    <Typography variant="body2" color="text.secondary">{lesson.from ? lesson.from : ''}~{lesson.to ? lesson.to : ''}</Typography>
                                </Box>
                            })}
                        </CardContent>
                    </Card></Grid>
            })}
        </Grid>
    </Box>
}

export default MemberSchedule