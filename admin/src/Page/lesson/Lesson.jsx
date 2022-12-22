import MyTable from "../../Component/MyTable"
import {Slide,Alert, Paper, Toolbar, Typography, Button,  Snackbar,Dialog, Backdrop, ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, getUserSession, } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import { useNavigate, useParams } from "react-router";
import EditPage from "./fragement/EditPage";
import { forwardRef } from "react";
import EditPageContent from "./fragement/EditPageContent";
import IconButton from "@mui/material/IconButton/IconButton";
import { AddCard, ArrowBack } from "@mui/icons-material";
import Grid from "@mui/material/Grid/Grid";
import Divider from "@mui/material/Divider/Divider";


const Lesson = () => {
    const [loading, setLoading] = useState(false)
    const [rightDrawer, setRightDrawer] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [datas, setDatas] = useState([])
    const [lesson, setLesson] = useState()
    const [page,setPage] = useState()
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
        apis.lessonGet(params.lessonid, 1).then(ret => {
            apiResult(ret, (r) => {
                setDatas(r.lesson_pages)
                setLesson(r)
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
        idx == -1 ? apis.lessonpagePost(data).then(ret => {
            apiResult(ret, (id) => {
                setAutoCloseRightDraw(true)
                setRightDrawer(false)
                loadDatas()
            }, err, errs)
        }) : apis.lessonpagePut(data).then(ret => {
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
        setPage(<EditPageContent data={item} itemindex={idx} onChange={(item,idx)=>{
            let ndatas = [...datas]
            ndatas[idx] = item
            setDatas(ndatas)
        }} onClose={() => { setPage() }} />)
    }
    const handleModify = (idx,item) => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditPage data={item} onSubmit={(data, err, errs) => { handleAfterEdit(idx, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleAdd = () => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditPage data={{ id: 0, lesson_id: lesson.id }} onSubmit={(data, err, errs) => { handleAfterEdit(-1, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleDelete = (idx, item) => {
        apis.lessonpageDelete(item.id).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 0
                setDatas(cc)
            }, setError)
        })
    }
    const handleEnable = (idx, item) => {
        apis.lessonpagePut({ id: item.id, status: 1 }).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 1
                setDatas(cc)
            }, setError)
        })
    }
    const TableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'title', showName: 'Title' },
        { name: 'pageNo', showName: 'Page No.' },
        {
            name: 'option', showName: 'Options', func: (v, idx, item) => {
                return <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
                    <Button variant="outlined" onClick={() => handleModify(idx, item)}>Edit</Button>
                    <Button variant={item.status == 0 ? "outlined" : "contained"} onClick={() => item.status != 0 ? handleDelete(idx, item) : handleEnable(idx, item)}>{item.status == 0 ? 'Disable' : 'Enable'}</Button>
                    {/* <Button variant="outlined" onClick={() => handleView(idx, item)}>Content</Button> */}
                    <Button variant="outlined" onClick={() => handleEdit(idx, item)}>Content</Button>
                </ButtonGroup>
            }
        },
    ]
    const Transition = forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}            
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar sx={{ p: 2 }}>
                    <IconButton onClick={()=>navigate('/lesson/course/'+lesson?.course_id)} title="Back"><ArrowBack /></IconButton>
                    <Divider variant="middle" orientation="vertical" flexItem/>
                    <Typography sx={{ml:2}} variant="h4" component='h4'>Lesson {lesson?.lessonNo} {lesson?.name}</Typography>
                    <Typography sx={{ flex: '1 1 10%' }} variant="h6" component="div" ></Typography>
                    <IconButton onClick={handleAdd} title="Add Page"><AddCard /></IconButton>
                </Toolbar>
            </Paper>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Paper sx={{p:2}}><pre style={{wordWrap:'break-word',whiteSpace:'pre-wrap'}}>{decodeURIComponent(lesson?.description)}</pre></Paper>
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
            {page && <Dialog fullScreen
                open={page ? true : false}
                // onClose={()=>{if(window.confirm("Are you sure to quit?")) setPage()}}
                TransitionComponent={Transition}
            >{page}</Dialog>}
        </>

    )
}
export default Lesson