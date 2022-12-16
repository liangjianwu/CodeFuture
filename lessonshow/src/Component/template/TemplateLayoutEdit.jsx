import { Box, MenuList, ListItemIcon, Divider, MenuItem, ListItemText, Grid, Paper, Alert, IconButton, Toolbar, Typography } from "@mui/material"
import { useState } from "react"
import { Close, Delete, Image, Link, RemoveRedEye, Save, SmartButton, Splitscreen, Subtitles, Title, ViewHeadline } from "@mui/icons-material";

import { EditForm, EditImage, EditUrl, EditButton, EditPanel } from "./TemplateEditForm";
import { TplButton, TplImage, TplSubtitle, TplText, TplTitle, TplUrl } from "./TemplateComponent";
import generateHtml from "./HtmlGenerate";


const TemplateLayoutEdit = (props) => {
    const [template, setTemplate] = useState(props.template ? props.template : [])
    const [selected, setSelected] = useState([])
    const [rightPanel, setRightPanel] = useState()
    const [preview, setPreview] = useState()
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
        props.onChange && props.onChange(template)
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
        props.onChange && props.onChange(template)
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
        props.onChange && props.onChange(template)
    }
    const handleComponentEdit = (index, index1, index2, value) => {
        const tt = [...template]
        tt[index][index1][index2] = value
        setTemplate(tt)
        props.onChange && props.onChange(template)
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
    const handlePreview = () => {
        setPreview(generateHtml(template))

    }
    return <Box sx={props.sx}>
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <Paper>
                    <MenuList>
                        <MenuItem onClick={handleSplit} disabled={selected.length <= 0}>
                            <ListItemIcon>
                                <Splitscreen fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Split Row</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleRemove} disabled={selected.length <= 0}>
                            <ListItemIcon>
                                <Delete fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Remove Item</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { handleAdd('title') }} >
                            <ListItemIcon>
                                <Title fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Title</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('subtitle') }} >
                            <ListItemIcon>
                                <Subtitles fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Subtitle</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('text') }} >
                            <ListItemIcon>
                                <ViewHeadline fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Text</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('image') }} >
                            <ListItemIcon>
                                <Image fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Image</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('button') }} >
                            <ListItemIcon>
                                <SmartButton fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Button</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => { handleAdd('url') }} >
                            <ListItemIcon>
                                <Link fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Url</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handlePreview} >
                            <ListItemIcon>
                                <RemoveRedEye fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Preview</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Paper>
            </Grid>
            <Grid item xs={7}>
                {!preview && <Paper style={{ padding: 20 }} onClick={(e) => { e.preventDefault(); e && e.stopPropagation && e.stopPropagation(); handleSelected() }} >
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
                {preview && <Paper style={{ padding: 5 }} >
                    <Toolbar sx={{ margin: 0, minHeight: "0 !important", padding: "0 !important" }}>
                        <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div" > </Typography>
                        <IconButton onClick={() => { setPreview() }}><Close /></IconButton>
                    </Toolbar>
                    <Box sx={{padding:0,border:1,borderColor:"#ccc"}}>
                    <div style={{ border: 1, width: "100%",minHeight:400, maxHeight: 800, overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: preview }}></div>
                    </Box>
                </Paper>}
            </Grid>
            <Grid item xs={3}>
                <Paper>
                    {rightPanel}
                    <Alert severity="info">You can use #variable# (like #name#,#phone#) to keep a space for replacing at "Email title","Title","Subtitle","Text"</Alert>
                </Paper>
            </Grid>
        </Grid>
    </Box>
}
export default TemplateLayoutEdit