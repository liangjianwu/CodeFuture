import { Button, List, ListItem, Grid, Box, Typography,  Alert } from "@mui/material"
import Paper from "@mui/material/Paper/Paper";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import { useEffect, useState } from "react"
import apis from "../../../api";
import { apiResult, getUserSession } from "../../../Utils/Common";
import OptionBar from "./OptionBar";

import PageEditor from "./PageEditor";
import SlideContentItem from "./SlideContentItem";

export default function EditPageContent(props) {
    const { data,itemindex,onChange,onClose } = props
    const [error, setError] = useState()
    const [content, setContent] = useState()
    const [leftSize,setLeftSize] = useState(8)
    getUserSession(apis)
    useEffect(() => {
        if (data.content && typeof data.content == 'string') {
            if(data.content.length>0) {
                data.content = JSON.parse(data.content)        
            }else {
                data.content = []
            }
        }else if(data.content == null || !data.content) {
            data.content = []
        }
        if(data.content.length === 0) {
            data.content.push({type:'text',content:''})
        }
        setContent(data.content)
    }, [])
    const [index, setIndex] = useState(0)
    const [subindex, setSubIndex] = useState(-1)
    const [model, setModel] = useState(2)    
    window.onkeydown = (e) => {
        if (e.keyCode === 112) {
            setModel((model + 1) % 3)
        }
    }
    const handleAddItem = () => {
        let dd = [...content]
        dd.push({ type: 'text', content: '' })
        setContent(dd)
        setIndex(dd.length - 1)
        setSubIndex(-1)
    }
    const handleAddChildItem = () => {
        let dd = [...content]        
        if(typeof dd[index].content === 'string') {
            let newcc = {type:'content',content:[dd[index]]}
            dd[index] = newcc            
        }
        if(subindex < 0) {
            dd[index].content.push({ type: 'text', content: '' })        
            setSubIndex(dd[index].content.length-1)
        }else {
            dd[index].content.splice(subindex,0,{type:'text',content:''})
            setSubIndex(subindex)
        }
        
        setContent(dd)
    }
    const handleOnChange = (idx,subidx,key, value) => {
        let dd = [...content]
        if(subidx>=0) {
            dd[idx].content[subidx][key] = value
        }else {
            dd[index][key] = value
        }        
        setContent(dd)
        setError()
    }
    const handleItemClick = (idx,subidx,item) => {        
        if(subidx < 0) {
            setIndex(idx)
            setSubIndex(-1)
        }else {
            setIndex(idx)
            setSubIndex(subidx)
        }
    }
    const handleRemoveItem=()=>{
        if(!window.confirm("Are you sure to remove the item?")) {
            return
        }
        let dd = [...content]
        if(subindex>=0) {
            dd[index].content.splice(subindex,1)
            if(dd[index].content.length>0) {
                setSubIndex(subindex<dd[index].content.length-1?subindex+1:dd[index].content.length-1)
            }else {
                setSubIndex(-1)
            }
        }else {
            dd.splice(index,1)
        }
        setContent(dd)
    }
    const handleSave = () =>{   
        data.content = JSON.stringify(content)     
        apis.lessonpagePut(data).then(ret=>{
            apiResult(ret,result=>{
                onChange(data,itemindex)
            },setError)
        })
    }
    const handleClose = () =>{        
        if(window.confirm("Save and quit? 'Cancel' will quit without save!")) {
            data.content = JSON.stringify(content)
            apis.lessonpagePut(data).then(ret=>{
                apiResult(ret,result=>{
                    onChange(data,itemindex)
                    onClose()
                },setError)
            })
        }else {
            onClose(0)
        }        
    }
    const handleRight = () => {
        setLeftSize(8)
    }
    const handleLeft = ()=>{
        setLeftSize(leftSize>4?leftSize-2:4)
    }
    return <Grid container spacing={2}>
        <Grid item xs={leftSize}>              
            <Toolbar style={{padding:"4px",paddingLeft:'20px',minHeight:'32px',background:'#ccca'}}>
                <Typography variant="h6" >Page {data.pageNo} : {data.title} </Typography>
            </Toolbar>           
            <List>
                {content && content.map((item, idx) => {
                    return <ListItem key={idx} sx={{ pt:0.5,pb:0.5,display: (model === 0 && index >= idx) || (model === 1 && index === idx) || model === 2 ? 'block' : 'none' }}>
                        <SlideContentItem item={item} idx={idx} subindex={subindex} selected={index === idx} model={model} onClick={handleItemClick} />
                    </ListItem>                    
                })}
            </List>
        </Grid>
        <Grid item xs={12-leftSize} sx={{bgcolor:'#eeeeeeee'}}>            
            <OptionBar onLeft={handleLeft} onRight={handleRight} onAdd={handleAddItem} onAddChild={handleAddChildItem} onRemove={handleRemoveItem} onSave={handleSave} onClose={handleClose}/>
            {content && content.length > 0 && <Box sx={{ marginTop: 6, p: 2,height:'90vh',display: 'flex', flexDirection: 'column', alignItems: 'center', }}>                
                <Box component="div">
                    <PageEditor content={subindex>=0?content[index].content[subindex]:content[index]} onChange={handleOnChange} index={index} subindex={subindex} />                    
                    {error && <Alert severity='error' onClose={() => setError()} >{error} </Alert>}
                </Box>
            </Box>}
        </Grid>
    </Grid>
}