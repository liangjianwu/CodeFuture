import MyTable from "../../Component/MyTable"
import {  Alert, Paper, Snackbar, Backdrop } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult,  getUserSession,  } from "../../Utils/Common";
import apis from "../../api";
import {  useParams } from "react-router";
import { Title } from "../../Component/MuiEx";

const TaskResult = () => {

    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [emailqueue, setEmailQueue] = useState([])
    const [tasklog, setTasklog] = useState([])
    const [error, setError] = useState()
    const session = getUserSession(apis)
    const params = useParams()
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadResult = () => {
        setLoading(true)
        apis.loadTaskResult(params.id).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                if (data.tasklog) {
                    const logs = []
                    data.tasklog.map(log => {
                        logs.push({
                            id: log.id,
                            customer: log.customer.name + "(" + log.customer.email + ")",
                            execute_result: log.execute_result,
                            create_time: log.create_time,
                        })
                    })
                    setTasklog(logs)
                }
                if (data.emailqueue) {
                    const queue = []
                    data.emailqueue.map(q => {
                        q.customers = JSON.parse(q.customers)
                        queue.push({
                            id: q.id,
                            customer: q.customers[0].Name + "(" + q.customers[0].Email + ")",
                            title: q.title,
                            result: q.sended == 1 ? ('success(' + q.trytimes + ')') : ('waiting(' + q.trytimes + ')'),
                            create_time: q.create_time,
                            schedule_time:q.schedule_time?new Date(q.schedule_time).toLocaleString():0,
                        })
                    })
                    setEmailQueue(queue)
                }
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadResult()
    }, [])

    const TasklogTableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'customer', showName: 'Customer' },
        { name: 'execute_result', showName: 'Error information' },
        { name: 'create_time', showName: 'Date' },]
    const EmailTableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'customer', showName: 'Customer' },
        { name: 'title', showName: 'Title' },
        { name:'schedule_time',showName:'Schedule Time'},
        { name: 'result', showName: 'Result' },
        { name: 'create_time', showName: 'Execute time' },
    ]
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            {tasklog && tasklog.length > 0 &&
                <Paper sx={{ padding:2,marginBottom: 2 }} >
                    <Title>Task error</Title>
                    <MyTable
                        rows={tasklog}
                        totalRow={tasklog.length}
                        headers={TasklogTableHeader}
                        checkbox={false}
                        rowsPerPage={tasklog.length}
                        showPageination={false}
                    /></Paper>}
            {emailqueue && emailqueue.length > 0 &&
                <Paper sx={{ padding:2,marginBottom: 2 }} >
                    <Title>Task result</Title>
                    <MyTable
                        rows={emailqueue}
                        totalRow={emailqueue.length}
                        headers={EmailTableHeader}
                        checkbox={false}
                        rowsPerPage={emailqueue.length}
                        showPageination={false}
                    /></Paper>}
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>

    )



}
export default TaskResult