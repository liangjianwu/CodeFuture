import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Stack, Snackbar, Backdrop,  } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, getUserSession,  } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import DownMenuItem from "../member/fragement/DownMenuItem";
import { useNavigate } from "react-router";
import TaskOptButton from "./fragement/TaskOptButton";
const Tasks = () => {
    const [selected, setSelected] = useState([])
    const [loading, setLoading] = useState(false)
    const [rightDrawer,setRightDrawer] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [tasks, setTasks] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [error, setError] = useState()
    const session = getUserSession(apis)
    const navigate = useNavigate()
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadTasks = (page, pagesize, countData) => {
        setLoading(true)
        apis.loadEmailTasks(page, pagesize, countData).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                setTasks(data.data)
                setCurrentPage(page)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadTasks(0, rowsPerPage, 1)
    }, [])
    const handleAddTask = () => {
        navigate('/email/task/0')
    }
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadTasks(page, rowsperpage, 0)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        loadTasks(0, rowsperpage, 0)
    }
    const handleRemoveTask = (id, idx) => {
        // setError()
        // window.confirm("Are you sure to delete the task?") && apis.removeTask({ id: id }).then(ret => {
        //     apiResult(ret, (data) => {
        //         let cc = [...templates]
        //         cc.splice(idx, 1)
        //         setTemplates(cc)
        //     }, setError)
        // })
    }
    const handleRightDrawer = () => {
        
    }
    const handleEditTask = (id,idx) =>{
        navigate('/email/task/'+id)
    }
    const handleReleaseTask = (id,idx)=>{
        if(tasks[idx].status != 0) return
        apis.setTaskStatus(id,1).then(ret=>{
            apiResult(ret,data=>{
                let tt = [...tasks]
                tt[idx].status = 1
                tt[idx].status_desc = 'Released'
                setTasks(tt)
            })
        })
    }
    const handleUnreleaseTask = (id,idx)=>{
        if(tasks[idx].status != 1) return
        apis.setTaskStatus(id,0).then(ret=>{
            apiResult(ret,data=>{
                let tt = [...tasks]
                tt[idx].status = 0
                tt[idx].status_desc = 'Editable'
                setTasks(tt)
            })
        })
    }
    const handleViewTaskResult = (id,idx)=>{
        navigate('/email/taskresult/'+id)
    }
    const TaskTableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'template_name', showName: 'Template name' },
        { name: 'title', showName: 'Email title' },
        {name:'datasource',showName:'Data source'},
        {name:'datasource_value',showName:'Data value'},
        {name:'schedule_time',showName:'Schedule'},
        { name: 'status_desc',showName:'Task status'},
        // { name: 'create_time', showName: 'Date' },
    ]
    const OptionButton = [
        { text: "Add", icon: <AddIcon fontSize="small" />, onClick: handleAddTask },
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
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any tasks, try to add one</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={tasks}
                totalRow={totalCount}
                headers={TaskTableHeader}
                checkbox={false}
                rowsPerPage={rowsPerPage}
                OpentionComponent={(id, idx) => {
                    return <TaskOptButton id={id} index={idx}
                        onEdit = {tasks[idx].status == 0 && handleEditTask}
                        onRelease = {tasks[idx].status == 0 && handleReleaseTask}
                        onUnrelease = {tasks[idx].status == 1 && handleUnreleaseTask}
                        onDetail = {tasks[idx].status > 1 && handleViewTaskResult}
                    />
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
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
export default Tasks