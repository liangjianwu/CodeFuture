import {  Tabs, Tab, FormControl,InputLabel,Select, Divider, MenuItem,  Paper,  TextField, Button, Alert, Snackbar,  } from "@mui/material"
import { useEffect, useState } from "react"

import { useParams } from "react-router";
import { apiResult, getUserSession, getVarsFromString } from "../../Utils/Common";
import apis from "../../api";
import TemplateLayoutEdit from "../../Component/template/TemplateLayoutEdit";
import {TemplateDataSource } from "./emaildatastruct";

const Template = () => {
    const [template, setTemplate] = useState([])
    const [error, setError] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [templateobj, setTemplateObj] = useState({})
    const [tabIndex, setTabIndex] = useState(1)
    const [datasource,setSource] = useState()
    const params = useParams()
    const userSession = getUserSession(apis)
    useEffect(() => {
        if (params.id > 0) {
            apis.getTemplate(params.id).then(ret => {
                apiResult(ret, data => {
                    setTemplateObj(data)
                    setTemplate(data.template ? JSON.parse(data.template) : [])
                    setTabIndex(0)
                    TemplateDataSource.map(t=>{
                        if(t.value === data.datasource) {
                            setSource(t)
                        }
                    })
                }, setError)
            })
        }
    }, [params.id])
    const handleTabChange = (event, value) => {
        setTabIndex(value)
    }
    const saveTemplate = (next) => {
        if (!templateobj.name || templateobj.name === "") {
            setError("The name of the template can't be empty")
        }
        if (!templateobj.title || templateobj.title === "") {
            setError("The email title can't be empty")
        }
        let vars = []
        const tv = getVarsFromString(templateobj.title)
        tv.length > 0 && vars.push({ type: "eTitle", variable: tv })
        template.map((item, index) => {
            item.map((subitem, index1) => {
                subitem.map((cc, index2) => {
                    if (cc.type === 'text' || cc.type === 'title' || cc.type === 'subtitle') {
                        if (cc.text && cc.text != "") {
                            const vv = getVarsFromString(cc.text)
                            vv.length > 0 && vars.push({ type: cc.type, pos: [index, index1, index2], variable: vv })
                        }
                    } else if (cc.type === 'images') {
                        if (cc.src && cc.src != "") {
                            const vv = getVarsFromString(cc.src)
                            vv.length > 0 && vars.push({ type: cc.type, pos: [index, index1, index2], variable: vv })
                        }
                    } else if (cc.type === "button" || cc.type === "url") {
                        if (cc.url && cc.url != "") {
                            const vv = getVarsFromString(cc.url)
                            vv.length > 0 && vars.push({ type: cc.type, pos: [index, index1, index2], variable: vv })
                        }
                    }
                })
            })
        })
        templateobj.template = JSON.stringify(template)
        templateobj.variables = JSON.stringify(vars)
        setError()
        for(const k in templateobj) {
            if(templateobj[k] == null) {
                delete templateobj[k]
            }
        }
        apis.editTemplate(templateobj).then(ret => {
            apiResult(ret, data => {
                templateobj.id = data
                setHintMsg("Saved successfully")
            }, setError)
        })
    }
    const handleFormChange = (k, v) => {
        let tt = {...templateobj}
        if(v == null || v == "") {
            delete tt[k]
        }else {
            tt[k] = v
        }
        setTemplateObj(tt)
    }
    const handleHintClose = () => {
        setHintMsg()
    }
    const handleTemplateChange = (t) => {
        setTemplate(t)
    }
    // const handleHouseChange = (e) => {
    //     setHouseId(e.target.value)
    // }
    // const handleLoadHouse = () => {
    //     apis.loadHouse(houseid).then(ret => {
    //         apiResult(ret, data => {
    //             console.log(data)
    //         }, setError)
    //     })
    // }
    const handleDataSourceChagne = (value) => {        
        TemplateDataSource.map(t=>{
            if(t.value === value) {
                setSource(t)
            }
        })
        setTemplateObj({ ...templateobj, datasource:value })
    }
    return <>
        {error && <Alert severity={"error"}>{error}</Alert>}
        <Tabs value={tabIndex} onChange={handleTabChange} >
            <Tab label="Define" />
            <Tab label="Layout" />
        </Tabs>
        {tabIndex === 0 && <Paper style={{ padding: 20, marginTop: 20 }}>
            <TextField margin="normal" required type="text" value={templateobj.name} onChange={(e) => handleFormChange('name', e.target.value)} fullWidth label="Template name" />
            <TextField margin="normal" type="text" value={templateobj.description} multiline onChange={(e) => handleFormChange('description', e.target.value)} fullWidth label="Template description" />
            <TextField margin="normal" type="text" value={templateobj.sender_name} onChange={(e) => handleFormChange('sender_name', e.target.value)} fullWidth label="The sender name of the email" />
            <TextField margin="normal" required type="text" value={templateobj.title} onChange={(e) => handleFormChange('title', e.target.value)} fullWidth label="Email title" />
            <TextField margin="normal" type="text" value={templateobj.reply} onChange={(e) => handleFormChange('reply', e.target.value)} fullWidth label="Reply email address" />            
            <FormControl fullWidth sx={{marginTop:2}}>
                <InputLabel id="demo-simple-select-label">Data source</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={templateobj.datasource}
                    label="Data source"                    
                    onChange={(e)=>{handleDataSourceChagne(e.target.value)}}
                >{
                    TemplateDataSource.map((s,i)=>{
                       return <MenuItem key={i} value={s.value}>{s.label}</MenuItem>
                    })
                }
                </Select>
            </FormControl>
            <Button variant="contained" sx={{ marginTop: 2, marginRight: 2 }} onClick={() => saveTemplate()}>Save</Button>
        </Paper>}
        {tabIndex === 1 && <TemplateLayoutEdit allowVariables ={true} sx={{ marginTop: 2, }} variables={datasource && datasource.struct} template={template} onChange={handleTemplateChange} />}
        
        {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
            <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
        </Snackbar>}
    </>
}
export default Template