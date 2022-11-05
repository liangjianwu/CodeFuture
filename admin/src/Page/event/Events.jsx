import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem,Skeleton, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, formToJson, getUserSession, sessionSet } from "../../Utils/Common";
import apis from "../../api";
import EventOptButton from "./fragement/EventOptButton";
import DownMenuItem from "../member/fragement/DownMenuItem";
import { useNavigate } from "react-router";
const Templates = () => {
    const [selected, setSelected] = useState([])
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [events, setEvents] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [error, setError] = useState()
    const session = getUserSession(apis)
    const navigate = useNavigate()
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadEvents = (page, pagesize, countData) => {
        setLoading(true)
        apis.loadEvents(page, pagesize, countData).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                setEvents(data.data)
                setCurrentPage(page)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadEvents(0, rowsPerPage, 1)
    }, [])
    const handleAddEvent = () => {
        navigate('/event/event/0')
    }
    const handleEditEvent = (id, idx) => {
        navigate('/event/event/' + id)
    }
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadEvents(page, rowsperpage, 0)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        loadEvents(0, rowsperpage, 0)
    }
    // const removeItemFromList = (idx) => {
    //     const t = templates[idx]
    //     t && apis.removeTemplate({ id: t.id }).then(ret => {
    //         apiResult(ret, data => {
    //             let cc = [...templates]
    //             cc.splice(idx, 1)
    //             setTemplates(cc)
    //         }, setError)
    //     })
    // }
    const handleRemoveEvent = (id, idx) => {
        setError()
        window.confirm("Are you sure to delete the event?") && apis.removeEvent({ id: id }).then(ret => {
            apiResult(ret, (data) => {
                let cc = [...events]
                cc.splice(idx, 1)
                setEvents(cc)
            }, setError)
        })
    }
    const handleCloneEvent = (id, dix) => {
        setError()
        window.confirm("Are you sure to clone the event?") && apis.cloneEvent({ id: id }).then(ret => {
            apiResult(ret, (data) => {
                let cc = [...events]
                cc.splice(0,0,data)
                setEvents(cc)
            }, setError)
        })
    }
    const handleResult = (id,idx) => {
        navigate('/event/applicant/'+id)
    }
    const EventTableHeader = [
        { name: 'id', showName: 'ID' },
        { name:'photo',showName:'Photo',func:(v)=>{
            return v?<img style={{maxWidth:100,maxHeight:100}} src={"/api/resource/photo?file="+v} />:<Skeleton variant="rectangular" width={100} height={100} />
        }},
        { name: 'name', showName: 'Event name' },
        { name: 'description', showName: 'Description' },        
        { name: 'begin', showName: 'Registration date',func:(v,i,row)=>{
            return row.begin + ' to ' + row.end
        } },
        { name: 'status',showName:'Status',func:(v)=>{
            return v == 2?'Released':(v == 1?'Editable':'Other')
        }},
        { name: 'publish_status',showName:'Publish',func:(v)=>{
            return v == 2?'Member':(v == 1?'All':'Hide')
        }},]        
    const OptionButton = [
        { text: "Add", icon: <AddIcon fontSize="small" />, onClick: handleAddEvent },
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
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any events, try to add one</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={events}
                totalRow={totalCount}
                headers={EventTableHeader}
                checkbox={false}
                rowsPerPage={rowsPerPage}
                OpentionComponent={(id, idx) => {
                    return <EventOptButton id={id} index={idx}
                        onEdit={(id, idx) => { handleEditEvent(id, idx) }}
                        onRemove={(id, idx) => { handleRemoveEvent(id, idx) }}                        
                        onClone={(id, idx) => { handleCloneEvent(id, idx) }}
                        onResult={(id, idx) => { handleResult(id, idx) }}
                    />
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />}
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>

    )
}
export default Templates