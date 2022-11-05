import React from 'react'
import { Dialog, AppBar,FormControlLabel,Switch, Toolbar, Slide, IconButton, Typography, Stack, Box } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const DailySchedule = (props) => {
    const { dateSchedule, onClose } = props
    const [showMember,setShowMember] = useState(true)
    let minTime = 100000
    let maxTime = 0
    Object.keys(dateSchedule.schedule).map((item, index) => {
        let coach = dateSchedule.schedule[item]
        coach.lessons.map(l=>{
            minTime = (l.begintime<minTime)?l.begintime:minTime
            maxTime = ((l.begintime+l.duration)>maxTime)?(l.begintime+l.duration):maxTime
        })
    })
    const begin = minTime-30
    const end = maxTime+30
    const unitHeight = 20
    const times = []
    for (let i = begin; i <= end; i += 15) {        
        times.push(i)
    }
    const getTimeString = (time) => {
        
        let h = Math.floor(time / 60)
        let m = time % 60
        let h1 = Math.floor((time + 15) / 60)
        let m1 = (time + 15) % 60
        const ff = (n) => {
            return n < 10 ? ("0" + n) : n
        }        
        return ff(h) + ":" + ff(m) + "~" + ff(h1) + ":" + ff(m1)
    }
    const getWeekDay = (wod) => {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return weekdays[wod]
    }
    return <Dialog fullScreen
        open={dateSchedule ? true : false}
        onClose={onClose}
        TransitionComponent={Transition}
    >
        <AppBar sx={{ position: 'fixed', height: 50 }}>
            <Toolbar sx={{ minHeight: "50px !important" }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: {xs:0,sm:2}, flex: 1,fontSize:{xs:'1.1rem',sm:'1.25rem'} }} variant="h6" component="div">
                    {dateSchedule.date} {getWeekDay(new Date(dateSchedule.date + " 12:00:00").getDay())}
                </Typography>
                {/* <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button> */}
                        <FormControlLabel control={<Switch color="default"  defaultChecked={showMember} onChange={(e) => {
                        setShowMember(e.target.checked)
                    }} />} label="Member" />
            </Toolbar>
        </AppBar>
        <Stack direction={"row"} sx={{ position:'fixed',top: "60px",bgcolor:'#fff',zIndex:'100', left: "10px" }}>
            <Stack direction="column">
                <Box sx={{ boxSizing:'border-box',height: unitHeight + "px", width: 100, border: "1px solid #0003",pl:1 }}><span style={{ fontSize: "10px" }}></span></Box>                
            </Stack>
            {Object.keys(dateSchedule.schedule).map((item, index) => {
                let coach = dateSchedule.schedule[item]
                return <Stack direction="column">
                    <Box sx={{ boxSizing:'border-box',height: unitHeight + "px", width: 250, borderBottom: "1px solid #0003",borderRight: "1px solid #0003",borderTop: "1px solid #0003",paddingLeft:1 }}><span style={{ fontSize: "10px",fontWeight:'bold' }}>{coach.coach.name}</span></Box>
                    
                </Stack>
            })}

        </Stack>
        <Stack direction={"row"} sx={{ mt: (60+unitHeight)+"px", ml: "10px" }}>
            <Stack direction="column">
                
                {times.map((time) => {
                    return <Box key={time} sx={{boxSizing:'border-box', height: unitHeight + "px", width: 100, borderLeft: "1px solid #0003",borderBottom: "1px solid #0003",borderRight: "1px solid #0003",pl:1 }}><span style={{ fontSize: "9px" }}>{getTimeString(time)}</span></Box>
                })}
            </Stack>
            {Object.keys(dateSchedule.schedule).map((item, index) => {
                let coach = dateSchedule.schedule[item]
                return <Stack direction="column">
                    <Box sx={{ boxSizing:'border-box',height: (unitHeight*times.length)+"px",width:250,borderBottom: "1px solid #0003",borderRight: "1px solid #0003",position:"relative",paddingLeft:1}}>
                        {coach.lessons.map((lesson) => {                            
                            console.log(lesson)
                            return <Box key={lesson.id} sx={{ boxSizing:'border-box',height: (unitHeight*(lesson.duration/15)) + "px",lineHeight:'16px',pl:1, width: 249, bgcolor:lesson.member_id == 0?'#f7df88':'#aaa2',borderBottom:'1px solid #fff',color:'#000',position:'absolute',left:0,top:(lesson.begintime-begin)/15*unitHeight + "px" }}>                                
                                <span style={{ fontSize: "10px" }}><span style={{fontWeight:'bold'}}>{Math.floor(lesson.begintime / 60) + ":" + (lesson.begintime % 60 < 10 ? ('0' + lesson.begintime % 60) : (lesson.begintime % 60))}~{Math.floor((lesson.begintime + lesson.duration) / 60) + ":" + ((lesson.begintime + lesson.duration) % 60 < 10 ? ('0' + (lesson.begintime + lesson.duration) % 60) : ((lesson.begintime + lesson.duration) % 60))}</span> ({lesson.duration}mins)</span>
                                {showMember && (lesson.members.length<= (Math.floor(lesson.duration/15) <=1?1:2*(lesson.duration/15)) ? lesson.members.map((member,index) => {                                                
                                                return <span key={index} style={{fontSize:'10px'}}> | {member?.name}</span>
                                            }):<span key={index} style={{fontSize:'10px'}}> | members</span>)}
                            </Box>
                        })}
                    </Box>
                </Stack>
            })}

        </Stack>

    </Dialog>

}
export default DailySchedule