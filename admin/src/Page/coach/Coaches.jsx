import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, formToJson, getUserSession, sessionSet } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import { useNavigate } from "react-router";
import CoachOptButton from "./fragement/CoachOptButton";
import DownMenuItem from "../member/fragement/DownMenuItem";
import EditCoach from "./fragement/EditCoach";
const Coaches = () => {
    const [loading, setLoading] = useState(false)
    const [rightDrawer,setRightDrawer] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [coaches, setCoaches] = useState([])
    const [error, setError] = useState()
    const navigate = useNavigate()
    const [autoCloseRightDraw,setAutoCloseRightDraw] = useState(true)
    const session = getUserSession(apis)    
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadCoaches = () => {
        setLoading(true)
        apis.loadCoaches().then(ret => {
            setLoading(false)
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
    }, [])

    const handleAfterEdit = (idx,coach)=>{
        let cc = [...coaches]
        if(idx>=0) {
            cc[idx] = coach
        }else {
            cc.push(coach)
        }        
        setCoaches(cc)
        setAutoCloseRightDraw(true)
        setRightDrawer(false)
    }
    const handleRightDrawer = () => {
        if(autoCloseRightDraw)
            setRightDrawer(false)
    }
    const handleViewTime = (id,idx)=>{
        navigate('/coach/coach/'+id)
    }
    const handleEdit = (id,idx)=>{
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditCoach coach={coaches[idx]} onAfterEdit={(data)=>{handleAfterEdit(idx,data)}} onClose={()=>{setRightDrawer(false)}}/>)
    }
    const handleAddCoach = ()=>{
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditCoach coach={{id:0}} onAfterEdit={(data)=>{handleAfterEdit(-1,data)}} onClose={()=>{setRightDrawer(false)}}/>)
    }
    const handleDelete = (id,idx)=>{
        window.confirm('Are you sure to delete the coach') && apis.removeCoach(id).then(ret=>{
            apiResult(ret,data=>{
                let cc = [...coaches]
                cc.splice(idx,1)
                setCoaches(cc)
            },setError)
        })
    }
    const CoachTableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'name', showName: 'Coach' },
        { name: 'email', showName: 'Email' },
        {name:'phone',showName:'Phone'},    
        // {name:'currentminutes',showName:'Work Hours',func:(v)=>{
        //     return <span style={{color:'green'}}>{Math.floor(Number(v)/60).toFixed(0) + "h " + Number(v)%60 + "m"}</span>
        // }} ,   
        // { name: 'currentmonth', showName: 'Current Month' },
    ]
    const OptionButton = [
        { text: "Add", icon: <AddIcon fontSize="small" />, onClick: handleAddCoach },
    ]
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar style={{ paddingLeft: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }}>
                        {OptionButton.map((item, index) => {
                            return item.subItems ? <DownMenuItem key={index} icon={item.icon} onClick={item.onClick} items={item.subItems} text={item.text} /> :
                                <MenuItem key={index} onClick={item.onClick}>
                                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}<ListItemText>{item.text}</ListItemText>
                                </MenuItem>
                        })}
                    </Stack>
                    <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div" ></Typography>
                </Toolbar>
            </Paper>
            {coaches.length == 0 && <Alert severity={"info"}>Ops! There is not any data</Alert>}
            {coaches.length > 0 && <MyTable
                height={650}
                rows={coaches}
                totalRow={coaches.length}
                headers={CoachTableHeader}
                checkbox={false}
                rowsPerPage={coaches.length}
                OpentionComponent={(id, idx) => {
                    return <CoachOptButton id={id} index={idx}
                        onEdit = {handleEdit}
                        onDelete = {handleDelete}                        
                        onViewTime = {handleViewTime}
                    />
                }}
            />}
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
            <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer ? true : false}>
                {rightDrawer}
            </RightDrawer>       
        </>

    )
}
export default Coaches