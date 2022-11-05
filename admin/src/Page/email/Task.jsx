import { Grid,  Alert, Paper,  Box, Typography, Chip, TextField, Stack, Button } from "@mui/material"

import { useEffect, useState } from "react"
import { useParams } from "react-router"
import apis from "../../api"
import MyTable from "../../Component/MyTable"
import { apiResult, formatDate, getUserSession } from "../../Utils/Common"
import { getTemplateDataSource } from "./emaildatastruct"

const Task = () => {
    const [error, setError] = useState()
    const [task, setTask] = useState({ id: 0, type: "email",status:0, schedule_time: new Date().toLocaleDateString() })
    const [crowsPerPage, setCRowsPerPage] = useState(12)
    const [selected, setSelected] = useState([])
    const [selectedIds, setSelectIds] = useState([])
    const [trowsPerPage, setTRowsPerPage] = useState(12)
    const [ctotalCount, setCTotalCount] = useState(0)
    const [ttotalCount, setTTotalCount] = useState(0)
    const [templates, setTemplates] = useState([])
    const [customers, setCustomers] = useState([])
    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(0)
    const [html, setHtml] = useState()
    const [template, setTemplate] = useState()
    const [title,setTitle] = useState()
    const [datasource, setTemplateDatasrouce] = useState()
    const [step, setStep] = useState(0)

    const session = getUserSession(apis)
    const params = useParams()
    useEffect(() => {

        loadCustomers(0, crowsPerPage, 1)
        loadTemplates(0, trowsPerPage, 1)
        
    }, [])
    const loadCustomers = (page, size, count) => {
        apis.loadUser(page, size, count).then(ret => {
            apiResult(ret, data => {
                if (count === 1) setCTotalCount(data.total)
                setCustomers(data.data)
            }, setError)
        })
    }
    const loadTemplates = (page, size, count) => {
        apis.loadTemplates(page, size, count).then(ret => {
            apiResult(ret, data => {
                count === 1 && setTTotalCount(data.total)
                setTemplates(data.data)
                if (params.id > 0) {
                    apis.getEmailTask(params.id).then(ret => {
                        apiResult(ret, data1 => {
                            setTask(data1.task)
                            setSelected(data1.customers)
                            let ids = []
                            data1.customers.map(c => {
                                ids.push(c.id)
                            })
                            setSelectIds(ids)
                            let t = data.data.filter(tt => tt.id == data1.task.template_id)
                            setTemplate(t[0])
                            setTemplateDatasrouce(getTemplateDataSource(t[0].datasource))
                        }, setError)
                    })
                }
            }, setError)
        })
    }
    const handleCChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadCustomers(page, rowsperpage, 0)
       
    }
    const handleCChangeRowsPerPage = (rowsperpage) => {
        setCRowsPerPage(rowsperpage)
        loadCustomers(0, rowsperpage, 0)
    }
    const handleTChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadTemplates(page, rowsperpage, 0)
    }
    const handleTChangeRowsPerPage = (rowsperpage) => {
        setTRowsPerPage(rowsperpage)
        loadTemplates(0, rowsperpage, 0)
    }
    const addOrRemoveCustomer = (scs, cc, add) => {
        let has = false
        for (let i = scs.length - 1; i >= 0; i--) {
            if (scs[i].id == cc.id) {
                if (add == false) {
                    scs.splice(i, 1)
                    return
                } else {
                    has = true
                    break;
                }
            }
        }
        if (add && !has) {
            scs.push({ id: cc.id, name: cc.name, email: cc.email })
        }
    }
    const handleCustomerSelected = (cs) => {
        let scs = [...selected]
        customers.map((c, i) => {
            if (cs.indexOf(c.id) >= 0) {
                addOrRemoveCustomer(scs, c, true)
            } else {
                addOrRemoveCustomer(scs, c, false)
            }
        })
        setSelected(scs)
        let ids = scs.map(s => { return s.id })
        setSelectIds(ids)
    }
    const handleTSelected = (ts) => {
        if (ts.length > 1) {
            setError('You can only choice one template!')
            setTemplate()
        } else {
            setError()
            if (ts.length == 1) {
                let t = templates.filter(tt => tt.id == ts[0])
                setTemplate(t[0])
                setTemplateDatasrouce(getTemplateDataSource(t[0].datasource))
            } else {
                setTemplate()
                setTemplateDatasrouce()
            }
        }
    }
    const removeSelectedCustomer = (i) => {
        let scs = [...selected]
        scs.splice(i, 1)
        setSelected(scs)
        let ids = scs.map(s => { return s.id })
        setSelectIds(ids)
    }
    const handleChange = (k, v) => {
        setTask({ ...task, [k]: v })
    }
    const onSetStep = (newstep) => {
        if (step === 0 && !template) {
            setError("You need to select one template")
            return
        }
        if (step === 1 && template &&template.datasource && template.datasource != 'none' && (!task.datasource || task.datasource.length === 0)) {
            setError("You need to set a data")
            return
        }
        if (step === 2 && selected.length === 0 && newstep > step) {
            setError('You need to select some customers')
            return
        }
        setError()
        setStep(newstep)
    }
    const handleSubmit = () => {

        if (template) {
            task.template_id = template.id
        } else {
            setError("Please select one template")
            return
        }
        if (template.datasource && template.datasource !== 'none' && (!task.datasource || task.datasource === "")) {
            setError("Please input a value of the " + template.label)
            return
        }
        if (!selectedIds || selectedIds.length == 0) {
            setError("Please select some customers")
            return
        } else {
            task.customers = selectedIds
        }
        setError()
        apis.editEmailTask(task).then(ret => {
            apiResult(ret, data => {
                task.id = data.id
                setHtml(data.html.html)
                setTitle(data.html.title)
                setStep(3)
            }, setError)
        })
    }
    const handleRelease =()=>{
        task && task.id > 0 && [0,1].indexOf(task.status)>=0 && apis.setTaskStatus(task.id,task.status === 0?1:0).then(ret=>{
            apiResult(ret,data=>{
                setTask({...task,status:task.status === 0?1:0})
            },setError)
        })
    }
    const CustomerTableHeader = [
        { name: 'name', showName: 'Family' },
        { name: 'email', showName: 'Email' },]
    const TemplateTableHeader = [
        { name: 'name', showName: 'Template' },
        { name: 'description', showName: 'Description' },
    ]
    const stepLabel = [
        'Select a template',
        'Set task parameters',
        'Select some family',
        'Preview'
    ]
    return (
        <>
            {error && <Alert severity={"error"}>{error}</Alert>}
            <Paper fullWidth sx={{padding:2,marginBottom:1}}>
            <Stack direction={'row'}>                
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div" >Task Setting — Step {step}: {stepLabel[step]} </Typography>
                {step > 0 && <Button variant='outlined' sx={{ marginRight: 2 }} onClick={() => onSetStep(step - 1)}>Back</Button>}
                {step < 2 && <Button variant='contained' onClick={() => onSetStep(step + 1)}>Next</Button>}
                {step === 2 && <Button variant='contained' onClick={() => handleSubmit()}>Submit</Button>}
                {step === 3 && <Button variant='contained' onClick={() => handleRelease()}>{task.status == 0?"Release":"Unrelease"}</Button>}
            </Stack></Paper>
            {step === 0 && <MyTable
                rows={templates}
                totalRow={ttotalCount}
                headers={TemplateTableHeader}
                singleOption={true}
                checkbox={true}
                onSelected={handleTSelected}
                rowsPerPage={trowsPerPage}
                defaultSelected={template ? [template.id] : []}
                onChangePage={handleTChangePage}
                onChangeRowsPerPage={handleTChangeRowsPerPage}
            />}

            {step === 2 && template && <Paper sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        
                        <MyTable                        
                            rows={customers}
                            totalRow={ctotalCount}
                            headers={CustomerTableHeader}
                            onSelected={handleCustomerSelected}
                            defaultSelected={selectedIds}
                            rowsPerPage={crowsPerPage}
                            checkbox={true}
                            onChangePage={handleCChangePage}
                            onChangeRowsPerPage={handleCChangeRowsPerPage}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{ margin: 2 }}>You have selected ({selected.length})</Typography>
                        <Box sx={{ maxHeight: 600, overflow: "auto" }}>
                            {selected && selected.map((c, i) => {
                                return <Chip
                                    label={c.name}
                                    variant="outlined"
                                    onDelete={() => removeSelectedCustomer(i)}
                                />
                            })}
                        </Box>
                    </Grid>
                </Grid>

            </Paper>}

            {step === 1 && template && <Paper sx={{ padding: 2 }}>
                <Box>
                    {template.datasource && template.datasource != 'none' && <TextField margin={"normal"} fullWidth label={datasource.label} value={task.datasource} onChange={(e) => handleChange('datasource', e.target.value)} />}                    
                    <TextField sx={{width:"200px"}}
                        margin="normal" type="date" name="schedule_time" 
                        onChange={(e) => handleChange('schedule_time', e.target.value)} 
                        value={task.schedule_time} id="schedule_time" label="Schedule Time"
                        InputLabelProps={{ shrink: true }} />                              
                </Box>
            </Paper>}
            {step === 3 && <Paper sx={{ padding: 3, borderColor: "#ccc",maxHeight:700,overflow:"auto" }}>
                <TextField fullWidth margin={"normal"} label={"To:"} variant="standard" multiline value={(selected.map(s=>{return s.email + "("+s.name+")"})).toString()} disabled></TextField>
                <TextField fullWidth margin={"normal"} label={"Title"} variant="standard" multiline value={title?title:template.title} disabled></TextField>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        {html && <div style={{ width: "100%",marginTop:"20px" }} dangerouslySetInnerHTML={{ __html: html }}></div>}
                    </Grid>
                    <Grid item xs={4}>
                        {html && <div style={{ maxWidth: "350px",width:"100%",marginTop:"20px" }} dangerouslySetInnerHTML={{ __html: html }}></div>}
                    </Grid>
                </Grid>
                
            </Paper>}
            
        </>
    )
}

export default Task