import { Box, MenuList, Tabs, Tab, ListItemIcon, Divider, MenuItem, ListItemText, Grid, Paper, Stack, TextField, Button, Alert, Snackbar } from "@mui/material"
import { useEffect, useState } from "react"
import { Delete, Image, Link, Save, SmartButton, Splitscreen, Subtitles, Title, ViewHeadline } from "@mui/icons-material";

import generateHtml from "./fragement/HtmlGenerate";
import { EditForm, EditImage, EditUrl, EditButton, EditPanel } from "./fragement/EditForm";
import { TplButton, TplImage, TplSubtitle, TplText, TplTitle, TplUrl } from "./fragement/TemplateComponent";
import { useParams } from "react-router";
import { apiResult, getUserSession, getVarsFromString } from "../../Utils/Common";
import apis from "../../api";


const Template = () => {
    const [template, setTemplate] = useState([])
    const [error, setError] = useState()
    const [hintMsg,setHintMsg] = useState()
    const [templateobj, setTemplateObj] = useState({})
    const [htmlValue, setHtmlValue] = useState()
    const [selected, setSelected] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [rightPanel, setRightPanel] = useState()
    const params = useParams()
    const userSession = getUserSession(apis)
    useEffect(() => {
        if (params.id > 0) {
            apis.getTemplate(params.id).then(ret => {
                apiResult(ret, data => {
                    setTemplateObj(data)
                    setTemplate(data.template ? JSON.parse(data.template) : [])
                    setTabIndex(1)
                }, setError)
            })
        }
    }, [params.id])
    const handleSelected = (index, index1, index2) => {
        const a = []
        index >= 0 && a.push(index)
        index1 >= 0 && a.push(index1)
        index2 >= 0 && a.push(index2)
        setSelected(a)
        if (a.length < 3) setRightPanel()
        if (a.length === 2) {
            let hasPanel = false
            template[index][index1].map((item, index3) => {
                if (item.type === 'panel') {
                    setRightPanel(<EditPanel obj={item} onEdit={(value) => { handleComponentEdit(index, index1, index3, value) }} />)
                    hasPanel = true
                }
            })
            if (!hasPanel) {
                const panel = { type: 'panel' }
                template[index][index1].push(panel)
                setRightPanel(<EditPanel obj={panel} onEdit={(value) => { handleComponentEdit(index, index1, template[index][index1].length - 1, value) }} />)
            }
        }
    }
    const handleSplit = () => {
        const tt = [...template]
        if (selected.length >= 1) {
            if (tt[selected[0]].length === 3) return
            tt[selected[0]].push([])
            setTemplate(tt)
        }
    }
    const handleAdd = (type) => {
        const tt = [...template]
        if (selected.length === 0) {
            tt.push([[{ type: type }]])
            setTemplate(tt)
        } else if (selected.length === 2) {
            tt[selected[0]][selected[1]].push({ type: type })
            setTemplate(tt)
        } else if (selected.length === 3) {
            tt[selected[0]][selected[1]].splice(selected[2], 0, { type: type })
            setTemplate(tt)
        }

    }
    const handleRemove = () => {
        const tt = [...template]
        if (selected.length === 3) {
            tt[selected[0]][selected[1]].splice(selected[2], 1)
            setTemplate(tt)
        } else if (selected.length === 2) {
            tt[selected[0]].splice(selected[1], 1)
            setTemplate(tt)
        }
        else if (selected.length === 1) {
            tt.splice(selected[0], 1)
            setTemplate(tt)
        }
    }
    const handleTabChange = (event, value) => {
        setTabIndex(value)
        if (value === 2 || value === 3) {
            const html = generateHtml(template)
            setHtmlValue(html)
            setRightPanel()
        }
    }
    const handleComponentEdit = (index, index1, index2, value) => {
        const tt = [...template]
        tt[index][index1][index2] = value
        setTemplate(tt)
    }
    const handleObjClicked = (index, index1, index2, obj) => {
        if (['title', 'subtitle', 'text'].indexOf(obj.type) >= 0) {
            setRightPanel(<EditForm obj={obj} onEdit={(value) => { handleComponentEdit(index, index1, index2, value) }} />)
        } else if (obj.type === 'image') {
            setRightPanel(<EditImage obj={obj} onEdit={(value) => { handleComponentEdit(index, index1, index2, value) }} />)
        } else if (obj.type === 'url') {
            setRightPanel(<EditUrl obj={obj} onEdit={(value) => { handleComponentEdit(index, index1, index2, value) }} />)
        } else if (obj.type === 'button') {
            setRightPanel(<EditButton obj={obj} onEdit={(value) => { handleComponentEdit(index, index1, index2, value) }} />)
        }
    }
    const saveTemplate = () => {
        if(!templateobj.name || templateobj.name === "") {
            setError("The name of the template can't be empty")
        }
        if(!templateobj.title || templateobj.title === "") {
            setError("The email title can't be empty")
        }        
        let vars = []
        const tv = getVarsFromString(templateobj.title,'#')
        tv.length>0 && vars.push({type:"eTitle",variable:tv})
        template.map((item,index)=>{
            item.map((subitem,index1)=>{
                subitem.map((cc,index2)=>{
                    if(cc.type === 'text' || cc.type === 'title' || cc.type==='subtitle') {
                        if(!cc.text||cc.text === "") {
                            vars.push({type:cc.type,pos:[index,index1,index2],variable:['$text']})
                        }else {
                            const vv = getVarsFromString(cc.text,'#')
                            vv.length>0 && vars.push({type:cc.type,pos:[index,index1,index2],variable:vv})
                        }
                    }else if(cc.type === 'image') {
                        if(!cc.src || cc.src === "") {
                            vars.push({type:cc.type,pos:[index,index1,index2],variable:['$src']})
                        }
                    }else if(cc.type === "button" || cc.type === "url") {
                        if(!cc.text || cc.text === "") {
                            vars.push({type:cc.type,pos:[index,index1,index2],variable:['$text']})
                        }
                        if(!cc.url || cc.url === "") {
                            vars.push({type:cc.type,pos:[index,index1,index2],variable:['$url']})
                        }
                    }
                })
            })
        })
        templateobj.template = JSON.stringify(template)
        templateobj.variables = JSON.stringify(vars)
        setError()
        apis.editTemplate(templateobj).then(ret=>{
            apiResult(ret,data=>{
                templateobj.id=data
                setHintMsg("Saved successfully")
            },setError)
        })
    }
    const handleFormChange = (k, v) => {               
        setTemplateObj({ ...templateobj, [k]: v })
    }
    const handleHintClose = ()=>{
        setHintMsg()
    }
    return <>
        {error && <Alert severity={"error"}>{error}</Alert>}
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <Paper sx={{ marginTop: 6 }}>
                    <MenuList>
                        <MenuItem onClick={handleSplit} disabled={selected.length <= 0 || tabIndex != 1}>
                            <ListItemIcon>
                                <Splitscreen fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Split Row</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleRemove} disabled={selected.length <= 0 || tabIndex != 1}>
                            <ListItemIcon>
                                <Delete fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Remove Item</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { handleAdd('title') }} disabled={tabIndex != 1}>
                            <ListItemIcon>
                                <Title fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Title</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('subtitle') }} disabled={tabIndex != 1}>
                            <ListItemIcon>
                                <Subtitles fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Subtitle</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('text') }} disabled={tabIndex != 1}>
                            <ListItemIcon>
                                <ViewHeadline fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Text</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('image') }} disabled={tabIndex != 1}>
                            <ListItemIcon>
                                <Image fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Image</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('button') }} disabled={tabIndex != 1}>
                            <ListItemIcon>
                                <SmartButton fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Button</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('url') }} disabled={tabIndex != 1}>
                            <ListItemIcon>
                                <Link fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Url</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { saveTemplate() }} >
                            <ListItemIcon>
                                <Save fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Save template</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Paper>
            </Grid>
            <Grid item xs={7}>
                <Tabs value={tabIndex} onChange={handleTabChange} >
                    <Tab label="Define" />
                    <Tab label="Layout" />
                    <Tab label="Data mapping" />
                    {/* <Tab label="Html" /> */}
                    <Tab label="Preview" />
                    
                </Tabs>
                {tabIndex === 0 && <Paper style={{ padding: 20 }}>
                    <TextField margin="normal" required type="text" value={templateobj.name} onChange={(e) => handleFormChange('name', e.target.value)} fullWidth label="Template name" />
                    <TextField margin="normal" type="text" value={templateobj.description} multiline onChange={(e) => handleFormChange('description', e.target.value)} fullWidth label="Template description" />
                    <TextField margin="normal" required type="text" value={templateobj.title} onChange={(e) => handleFormChange('title', e.target.value)} fullWidth label="Email title" />
                </Paper>}
                {tabIndex === 1 && <Paper style={{ padding: 20 }} onClick={(e) => { e.preventDefault(); e && e.stopPropagation && e.stopPropagation(); handleSelected() }} >
                    <Grid container spacing={1} onClick={(e) => { e.preventDefault(); e && e.stopPropagation && e.stopPropagation(); handleSelected() }}
                        sx={{ minHeight: 150, border: "1px " + (selected.length === 0 ? "solid " : "dashed ") + "grey", padding: 1 }}>
                        {template.map((item, index) => {
                            if (item.length === 0) {
                                const isSelected0 = selected.length === 1 && selected[0] === index
                                return <Grid key={index} sx={{ background: '#fff', minHeight: 30, padding: 1, border: "1px " + (isSelected0 ? "solid " : "dashed ") + "grey" }}
                                    onClick={(e) => { e.preventDefault(); e && e.stopPropagation && e.stopPropagation(); handleSelected(index) }} item xs={12}></Grid>
                            }
                            return item.map((child, index1) => {
                                const isSelected1 = selected.length === 2 && selected[0] === index && selected[1] === index1
                                let panel = null
                                child.map(sitem => {
                                    if (sitem.type === 'panel') return panel = sitem
                                })
                                return <Grid key={index1} sx={{ background: panel && panel.backgroundColor ? panel.backgroundColor : '#fff', minHeight: 30, padding: 1, marginLeft: panel && panel?.paddingLeft, marginRight: panel && panel?.paddingRight, border: "1px " + (isSelected1 ? "solid " : "dashed ") + "grey" }}
                                    onClick={(e) => { e.preventDefault(); e && e.stopPropagation && e.stopPropagation(); handleSelected(index, index1) }} item xs={12 / item.length}>
                                    {child.map((subchild, index2) => {
                                        const isSelected2 = selected.length === 3 && selected[0] === index && selected[1] === index1 && selected[2] === index2
                                        if (subchild.type !== 'panel') {
                                            return <Box key={index2} sx={{ border: "1px " + (isSelected2 ? "solid grey" : "dashed grey"), padding: 1, }} onClick={(e) => { e.preventDefault(); e && e.stopPropagation && e.stopPropagation(); handleSelected(index, index1, index2); handleObjClicked(index, index1, index2, subchild) }}>
                                                {['title'].indexOf(subchild.type) >= 0 && <TplTitle data={subchild} />}
                                                {['subtitle'].indexOf(subchild.type) >= 0 && <TplSubtitle data={subchild} />}
                                                {['text'].indexOf(subchild.type) >= 0 && <TplText data={subchild} />}
                                                {['image'].indexOf(subchild.type) >= 0 && <TplImage data={subchild} />}
                                                {['url'].indexOf(subchild.type) >= 0 && <TplUrl data={subchild} />}
                                                {['button'].indexOf(subchild.type) >= 0 && <TplButton data={subchild} />}
                                            </Box>
                                        }
                                    })}
                                </Grid>
                            })
                        })
                        }
                    </Grid>
                </Paper>}
                {/* {tabIndex === 2 && <Paper style={{ padding: 20 }}>
                    <TextField multiline={true} fullWidth rows={30} disabled value={htmlValue} />
                </Paper>} */}
                {tabIndex === 2 && <Paper style={{ padding: 15 }}>
                    
                </Paper>}
                {tabIndex === 3 && <Paper style={{ padding: 15 }}>
                    <div style={{ border: 1, width: "100%",minHeight:400, maxHeight: 800, overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: htmlValue }}></div>
                </Paper>}
                
            </Grid>
            <Grid item xs={3}>
                <Paper sx={{ marginTop: 6 }}>
                    {rightPanel}
                    <Alert severity="info">You can use #variable# (like #name#,#phone#) to keep a space for replacing at "Email title","Title","Subtitle","Text"</Alert>
                </Paper>
            </Grid>
        </Grid>
        {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>
}
export default Template