import MyTable from "../../Component/MyTable"
import {Alert, Paper, Toolbar, Typography, Button, Snackbar, Backdrop, ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, getUserSession, } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import { useNavigate, useParams } from "react-router";

import EditLesson from "./fragement/EditLesson";
import IconButton from "@mui/material/IconButton/IconButton";
import { AddCard, ArrowBack } from "@mui/icons-material";
import Grid from "@mui/material/Grid/Grid";
import Divider from "@mui/material/Divider/Divider";

const Course = () => {
    const [loading, setLoading] = useState(false)
    const [rightDrawer, setRightDrawer] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [datas, setDatas] = useState([])
    const [course, setCourse] = useState()
    const [error, setError] = useState()
    const navigate = useNavigate()
    const [autoCloseRightDraw, setAutoCloseRightDraw] = useState(true)
    const session = getUserSession(apis)
    const params = useParams()
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadDatas = () => {
        setLoading(true)
        apis.courseGet(params.courseid, 1).then(ret => {
            apiResult(ret, (r) => {
                setDatas(r.lessons)
                setCourse(r)
            }, setError)
            setLoading()
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadDatas()
    }, [])

    const handleAfterEdit = (idx, data, err, errs) => {
        data.description = encodeURIComponent(data.description)
        idx == -1 ? apis.lessonPost(data).then(ret => {
            apiResult(ret, (id) => {
                setAutoCloseRightDraw(true)
                setRightDrawer(false)
                loadDatas()
            }, err, errs)
        }) : apis.lessonPut(data).then(ret => {
            apiResult(ret, (retdata) => {
                setAutoCloseRightDraw(true)
                setRightDrawer(false)
                loadDatas()
            }, err, errs)
        })
    }
    const handleRightDrawer = () => {
        if (autoCloseRightDraw)
            setRightDrawer(false)
    }

    const handleEdit = (idx, item) => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditLesson data={item} onSubmit={(data, err, errs) => { handleAfterEdit(idx, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleAdd = () => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditLesson data={{ id: 0, course_id: course.id }} onSubmit={(data, err, errs) => { handleAfterEdit(-1, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleDelete = (idx, item) => {
        apis.lessonDelete(item.id).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 0
                setDatas(cc)
            }, setError)
        })
    }
    const handleEnable = (idx, item) => {
        apis.lessonPut({ id: item.id, status: 1 }).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 1
                setDatas(cc)
            }, setError)
        })
    }
    const handleView = (idx, item) => {
        navigate('/lesson/lesson/' + item.id)
    }
    const TableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'name', showName: 'Name' },
        { name: 'description',showName:'Description',func:(v,idx,item)=>{
            v = decodeURIComponent(v)
            return v.substring(0,20) + (v.length>20?'...':'')
        }},
        { name: 'lessonNo', showName: 'Lesson No.' },
        {
            name: 'option', showName: 'Options', func: (v, idx, item) => {
                return <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
                    <Button variant="outlined" onClick={() => handleEdit(idx, item)}>Edit</Button>
                    <Button variant={item.status == 0 ? "outlined" : "contained"} onClick={() => item.status != 0 ? handleDelete(idx, item) : handleEnable(idx, item)}>{item.status == 0 ? 'Disable' : 'Enable'}</Button>
                    <Button variant="outlined" onClick={() => handleView(idx, item)}>View</Button>
                </ButtonGroup>
            }
        },
    ]
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar sx={{ p: 2 }}>
                    <IconButton onClick={()=>navigate('/lesson/courses')} title="Back"><ArrowBack /></IconButton>
                    <Divider variant="middle" orientation="vertical" flexItem/>
                    <Typography sx={{ml:2}} variant="h4" component='h4'>{course?.name}</Typography>
                    <Typography sx={{ flex: '1 1 10%' }} variant="h6" component="div" ></Typography>
                    <IconButton onClick={handleAdd} title="Add Lesson"><AddCard /></IconButton>
                </Toolbar>
            </Paper>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Paper sx={{p:2}}><pre style={{wordWrap:'break-word',whiteSpace:'pre-wrap'}}>{decodeURIComponent(course?.description)}</pre></Paper>
                </Grid>
                <Grid item xs={6}>
                    {datas.length == 0 && <Alert severity={"info"}>Ops! There is not any lesson</Alert>}
                    {datas.length > 0 && <MyTable
                        height={650}
                        rows={datas}
                        totalRow={datas.length}
                        headers={TableHeader}
                        checkbox={false}
                        rowsPerPage={datas.length}
                    />}
                </Grid>                
            </Grid>

            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
            <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer ? true : false}>
                {rightDrawer}
            </RightDrawer>
        </>

    )
}
export default Course