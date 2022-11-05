import { Tabs, Tab, Skeleton, Backdrop, CircularProgress, Stack, Typography, Grid, Paper, TextField, Button, Alert, Snackbar, } from "@mui/material"
import { useEffect, useState } from "react"
import generateHtml from "../../Component/template/HtmlGenerate";
import { useNavigate, useParams } from "react-router";
import { apiResult, getUserSession, formatDate, cleanJson } from "../../Utils/Common";
import apis from "../../api";
import TemplateLayoutEdit from "../../Component/template/TemplateLayoutEdit";
import { SingleSelector } from "../../Component/MuiEx";
// import Uploady, { useItemFinishListener, useItemErrorListener, useItemStartListener } from "@rpldy/uploady";
// import { asUploadButton } from "@rpldy/upload-button";
import FormEditor from "../../Component/template/FormEditor";
import FormGenerator from "../../Component/template/FormGenerator";
import Uploader from "../../Component/Uploader";


const Template = () => {
    const [template, setTemplate] = useState([])
    const [error, setError] = useState()
    const [fieldErrors, setFieldErrors] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [eventObj, setEventObj] = useState({ id: 0, form: [], status: 1, begin: new Date().toLocaleDateString(), end: new Date().toLocaleDateString() })
    const [tabIndex, setTabIndex] = useState(1)
    const params = useParams()
    const userSession = getUserSession(apis)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (params.id > 0) {
            apis.getEvent(params.id).then(ret => {
                apiResult(ret, data => {
                    if (data.form) {
                        data.form = JSON.parse(data.form)
                    } else {
                        data.form = []
                    }
                    setEventObj(data)
                    if (data.template) {
                        setTemplate(JSON.parse(data.template))
                    }
                    setTabIndex(0)
                })
            })
        }
    }, [params.id])

    const handleTabChange = (event, value) => {
        setTabIndex(value)
        // if (value === 2 || value === 3) {
        //     const html = generateHtml(template)
        //     setHtmlValue(html)
        //     setRightPanel()
        // }
    }
    const handleSubmit = (preview) => {
        let postObj = { ...eventObj }
        if (!postObj.name || postObj.name === "") {
            setError("The name of the event can't be empty")
        }
        postObj.template = JSON.stringify(template)
        postObj.html = generateHtml(template)
        postObj.form = JSON.stringify(postObj.form)
        postObj = cleanJson(postObj)
        setError()
        setFieldErrors()
        apis.editEvent(postObj).then(ret => {
            apiResult(ret, data => {
                setEventObj({ ...eventObj, id: data.id, code: data.code })
                setHintMsg("Saved successfully")
                if (preview) {
                    navigate('/event/preview/' + data.id)
                }
            }, setError, setFieldErrors)
        })
    }
    const handleFormChange = (k, v) => {
        setEventObj({ ...eventObj, [k]: v })
        setError()
        setFieldErrors()
    }
    const handleHintClose = () => {
        setHintMsg()
    }
    const handleChange = (t) => {
        setTemplate(t)
    }
    const handleAddFormItem = (type, idx) => {
        let item = { type: type }
        if (type === 'section') {
            let label = window.prompt("Section label")
            if (!label || label === "") return
            item = { type: type, items: [], label: label }
        }
        const form = [...eventObj.form]
        if (idx >= 0) {
            form[idx].items.push(item)
        } else {
            form.push(item)
        }
        setEventObj({ ...eventObj, form: form })
    }
    const editFormSection = (idx) => {
        let newVal = window.prompt("Edit the section label", eventObj.form[idx].label)
        if (newVal && newVal !== "") {
            const form = [...eventObj.form]
            form[idx].label = newVal
            setEventObj({ ...eventObj, form: form })
        }
    }
    const removeFormItem = (item, idx) => {
        const form = [...eventObj.form]
        if (idx.length === 1) {
            form.splice(idx[0], 1)
        } else if (idx.length === 2) {
            form[idx[0]].items.splice(idx[1], 1)
        }
        setEventObj({ ...eventObj, form: form })
    }
    const handleFormItemChange = (item, idx) => {
        const form = [...eventObj.form]
        if (idx.length === 1) {
            form[idx[0]] = item
        } else if (idx.length === 2) {
            form[idx[0]].items[idx[1]] = item
        }
        setEventObj({ ...eventObj, form: form })
    }
    const handleRelease = () => {
        let status = -1
        if (eventObj.status == 1 && window.confirm("Are you sure to release the event?")) {
            status = 2
        } else if (eventObj.status == 2 && window.confirm("Are you sure to take down the event?")) {
            status = 1
        }
        if (status === -1) return;
        apis.setEventStatus(eventObj.id, status).then(ret => {
            apiResult(ret, data => {
                setEventObj({ ...eventObj, status: status })
                setHintMsg("Updated successfully")
                if (status === 2) {
                    let host = window.location.hostname
                    let hosts = host.split('.')
                    hosts.length >= 3 && hosts.splice(0, 1)
                    window.open("https://" + hosts.join('.') + "/event/" + eventObj.code)
                }
            })
        })
    }
    const handlePublish = (status) => {
        apis.setEventPublishStatus(eventObj.id, status).then(ret => {
            apiResult(ret, data => {
                setEventObj({ ...eventObj, publish_status: status })
                setHintMsg("Updated successfully")
            })
        })
    }
    const handleView = () => {
        let host = window.location.hostname
        let hosts = host.split('.')
        hosts.length >= 3 && hosts.splice(0, 1)
        eventObj.status == 2 && window.open("https://" + hosts.join('.') + "/event/" + eventObj.code)
    }
    // const LogProgress = () => {
    //     useItemFinishListener((res) => {
    //         //console.log(res.uploadResponse.data.data)        
    //         let filename = res.uploadResponse.data.data
    //         setEventObj({ ...eventObj, photo: filename })
    //         setLoading(false)

    //     })
    //     useItemErrorListener((res) => {
    //         setLoading(false)
    //         setError(res.uploadResponse.data.data.error)
    //     })
    //     useItemStartListener((obj) => {
    //         setError()
    //         setLoading(true)
    //     })
    //     return null;
    // }
    // const DivUploadButton = asUploadButton((props) => {
    //     return <div {...props} style={{ width: 150, height: 35, padding: 6, cursor: "pointer", border: '1px solid grey' }}>
    //         {loading?<CircularProgress />:<Typography variant="subtitle2">SELETE A PHOTO</Typography>}
    //     </div>
    // });
    return <>
        {error && <Alert severity={"error"}>{error}</Alert>}
        {loading && <Backdrop open={loading} ><CircularProgress color="inherit" /></Backdrop>}
        <Tabs value={tabIndex} onChange={handleTabChange} >
            <Tab label="Event Setting" />
            <Tab label="Page Design" />
            <Tab label="Form Design" />
        </Tabs>

        {tabIndex === 0 && <Paper sx={{ marginTop: 2, padding: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField margin="normal" required type="text" value={eventObj.name} onChange={(e) => handleFormChange('name', e.target.value)} fullWidth label="Event name"
                                error={fieldErrors && fieldErrors.name ? true : false}
                                helperText={fieldErrors && fieldErrors.name ? fieldErrors.name : ''}
                                autoFocus />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField margin="normal" type="text" value={eventObj.description} multiline rows={2} onChange={(e) => handleFormChange('description', e.target.value)} fullWidth label="Event description" />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    {eventObj.photo ? <img style={{ maxHeight: 150 }} src={eventObj.photo.substring(0, 4) != 'http' ? ("/api/resource/photo?file=" + eventObj.photo) : eventObj.photo}></img> : <Skeleton variant="rectangular" sx={{ mb: 2 }} width={200} height={140} />}
                    {/* <Uploady
                        destination={apis.uploadResource(getUserSession())}>
                        <LogProgress />
                        <DivUploadButton />
                    </Uploady> */}
                    <Uploader onUpload={(filename) => setEventObj({ ...eventObj, photo: filename })} onFailed={setError} />
                </Grid>
                <Grid item xs={4}>
                    <SingleSelector items={['Information', 'Apply with form','Apply']} values={[0, 1,2]} defaultValue={eventObj.apply} name="apply" onChange={(name, v) => handleFormChange(name, v)} />
                </Grid>
                {eventObj.apply == 1 && <Grid item xs={4}>
                    <SingleSelector items={['Guest', 'Only member']} values={[0, 1]} defaultValue={eventObj.sign} name="sign" onChange={(name, v) => handleFormChange(name, v)} />
                </Grid>}
                {eventObj.apply == 1 && <Grid item xs={4}>
                    <SingleSelector items={['No payment', 'Pay to apply']} values={[0, 1]} defaultValue={eventObj.pay} name="pay" onChange={(name, v) => handleFormChange(name, v)} />
                </Grid>}

                {eventObj.apply == 1 && <Grid item xs={6}>
                    <TextField fullWidth
                        margin="normal" type="date"
                        onChange={(e) => handleFormChange('begin', e.target.value)}
                        value={eventObj.begin} label="Registration begin date"
                        InputLabelProps={{ shrink: true }} error={fieldErrors && fieldErrors.begin ? true : false}
                        helperText={fieldErrors && fieldErrors.begin ? fieldErrors.begin : ''} />
                </Grid>}
                {eventObj.apply == 1 && <Grid item xs={6}>
                    <TextField fullWidth
                        margin="normal" type="date"
                        onChange={(e) => handleFormChange('end', e.target.value)}
                        value={eventObj.end} label="Registration end date"
                        InputLabelProps={{ shrink: true }} error={fieldErrors && fieldErrors.end ? true : false}
                        helperText={fieldErrors && fieldErrors.end ? fieldErrors.end : ''} />
                </Grid>}
                {eventObj.apply == 1 && eventObj.pay == 1 && <Grid item xs={4}>
                    <TextField margin="normal" type="number" value={eventObj.fee} onChange={(e) => handleFormChange('fee', e.target.value)} fullWidth label="Event fee (CAD)" />
                </Grid>}
                <Grid item xs={12}>
                    <Stack direction="row">
                        {eventObj.status == 1 && <Button variant="contained" onClick={() => handleSubmit(false)} sx={{ marginRight: 2 }}>Save</Button>}
                        {eventObj.status == 1 && <Button variant="outlined" onClick={() => handleSubmit(true)} sx={{ marginRight: 2 }}>Save & Preview</Button>}
                        {eventObj.id > 0 && <Button variant="outlined" onClick={() => handleRelease()} sx={{ marginRight: 2 }}>{eventObj.status == 1 ? "Release & View" : "Take down"}</Button>}
                        {eventObj.status == 2 && <Button variant="outlined" onClick={() => handleView()} sx={{ marginRight: 2 }}>View</Button>}
                        {eventObj.status == 2 && <SingleSelector items={['All', 'Member', 'Hide']} values={[1, 2, 0]} defaultValue={eventObj.publish_status} label="Publish to:" onChange={(n, v) => handlePublish(v)} />}
                    </Stack>

                    {/* {eventObj.publish_status != 1 && <Button variant="outlined" onClick={() => handlePublish(1)} sx={{ marginRight: 2 }}>Publish to public</Button>}
                    {eventObj.publish_status != 2 && <Button variant="outlined" onClick={() => handlePublish(2)} sx={{ marginRight: 2 }}>Publish to member</Button>}
                    {eventObj.publish_status != 0 && <Button variant="outlined" onClick={() => handlePublish(2)} sx={{ marginRight: 2 }}>Hide for all</Button>} */}

                </Grid>
            </Grid>
        </Paper>}
        {tabIndex === 2 && <Grid container spacing={2}>
            <Grid item xs={8}>
                {eventObj && eventObj.form && <FormEditor form={eventObj.form} onFormSectionEdit={editFormSection} onItemAdd={handleAddFormItem} onItemRemove={removeFormItem} onItemChange={handleFormItemChange} />}
            </Grid>
            <Grid item xs={4}>
                {eventObj && eventObj.form && <FormGenerator form={eventObj.form} />}
            </Grid></Grid>}
        {tabIndex === 1 && <TemplateLayoutEdit sx={{ marginTop: 2, }} template={template} onChange={handleChange} />}
        {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
            <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
        </Snackbar>}
    </>
}
export default Template