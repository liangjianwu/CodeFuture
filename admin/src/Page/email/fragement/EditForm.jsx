import { Avatar, Divider } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { formToJson } from '../../../Utils/Common';
import { useEffect, useState } from 'react';
import { SingleSelector } from '../../../Component/MuiEx';

const EditForm = (props) => {    
    const [obj,setObj] = useState(props.obj)
    const handleChange = (e,key) => {                
        const tobj = {...obj,[key]:e.target.value}
        props.onEdit && props.onEdit(tobj)        
        setObj(tobj)
    }
    const handleSelector = (value,key) =>{
        const tobj = {...obj,[key]:value}
        props.onEdit && props.onEdit(tobj)        
        setObj(tobj)
    }
    useEffect(()=>{
        setObj(props.obj)
    },[props.obj])
    return <Box sx={{ p: 2 }}>
        <TextField margin="normal" multiline={props.obj && props.obj.type === 'text'} type="text" onChange={(e)=>handleChange(e,'text')} value={obj && obj.text} fullWidth label="Text" />
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'fontSize')} value={obj && obj.fontSize} fullWidth label="Text size (like 16px)"/>
        <SingleSelector items={['left','center','right']} values={['left','center','right']} defaultValue={obj && obj.textAlign ? ['left','center','right'].indexOf(obj.textAlign):0} onChange={(name,value)=>handleSelector(value,'textAlign')}/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'color')} value={obj && obj.color?obj.color:'#000000'} fullWidth label="Text color"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'marginTop')} value={obj && obj.marginTop?obj.marginTop:'5px'} fullWidth label="Margin top"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'marginBottom')} value={obj && obj.marginBottom?obj.marginBottom:'5px'} fullWidth label="Margin Bottom"/>
    </Box>
}
const EditImage = (props)=>{
    const [obj,setObj] = useState(props.obj)
    const handleChange = (e,key) => {                
        const tobj = {...obj,[key]:e.target.value}
        props.onEdit && props.onEdit(tobj)        
        setObj(tobj)
    }
    useEffect(()=>{
        setObj(props.obj)
    },[props.obj])
    return <Box sx={{ p: 2 }}>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'src')} value={obj && obj.src} fullWidth label="Image url"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'width')} value={obj && obj.width} fullWidth label="Image width (default 100%)"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'height')} value={obj && obj.height} fullWidth label="Image height (default 100%)"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'marginTop')} value={obj && obj.marginTop?obj.marginTop:'5px'} fullWidth label="Margin top"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'marginBottom')} value={obj && obj.marginBottom?obj.marginBottom:'5px'} fullWidth label="Margin Bottom"/>
    </Box>
}
const EditUrl = (props)=>{
    const [obj,setObj] = useState(props.obj)
    const handleChange = (e,key) => {                
        const tobj = {...obj,[key]:e.target.value}
        props.onEdit && props.onEdit(tobj)        
        setObj(tobj)
    }
    const handleSelector = (value,key) =>{
        const tobj = {...obj,[key]:value}
        props.onEdit && props.onEdit(tobj)        
        setObj(tobj)
    }
    useEffect(()=>{
        setObj(props.obj)
    },[props.obj])
    return <Box sx={{ p: 2 }}>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'text')} value={obj && obj.text} fullWidth label="Text"/>        
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'url')} value={obj && obj.url} fullWidth label="Url"/>
        <SingleSelector items={['left','center','right']} values={['left','center','right']} defaultValue={obj && obj.textAlign ? ['left','center','right'].indexOf(obj.textAlign):0} onChange={(name,value)=>handleSelector(value,'textAlign')}/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'fontSize')} value={obj && obj.fontSize} fullWidth label="Text size (like 16px)"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'color')} value={obj && obj.color?obj.color:'#1976d2'} fullWidth label="Text color"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'marginTop')} value={obj && obj.marginTop?obj.marginTop:'5px'} fullWidth label="Margin top"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'marginBottom')} value={obj && obj.marginBottom?obj.marginBottom:'5px'} fullWidth label="Margin Bottom"/>
    </Box>
}
const EditButton = (props)=>{
    const [obj,setObj] = useState(props.obj)
    const handleChange = (e,key) => {                
        const tobj = {...obj,[key]:e.target.value}
        props.onEdit && props.onEdit(tobj)        
        setObj(tobj)
    }
    useEffect(()=>{
        setObj(props.obj)
    },[props.obj])
    return <Box sx={{ p: 2 }}>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'text')} value={obj && obj.text} fullWidth label="Text"/>        
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'url')} value={obj && obj.url} fullWidth label="Url"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'fontSize')} value={obj && obj.fontSize?obj.fontSize:'16px'} fullWidth label="Text size (default 16px)"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'color')} value={obj && obj.color?obj.color:'#ffffff'} fullWidth label="Text color"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'backgroundColor')} value={obj && obj.backgroundColor?obj.backgroundColor:'#1976d2'} fullWidth label="Background color"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'height')} value={obj && obj.height?obj.height:'40px'} fullWidth label="Button height (default 40px)"/>        
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'marginTop')} value={obj && obj.marginTop?obj.marginTop:'5px'} fullWidth label="Margin top"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'marginBottom')} value={obj && obj.marginBottom?obj.marginBottom:'5px'} fullWidth label="Margin Bottom"/>
    </Box>
}
const EditPanel = (props)=>{
    const [obj,setObj] = useState(props.obj)
    const handleChange = (e,key) => {                
        const tobj = {...obj,[key]:e.target.value}
        props.onEdit && props.onEdit(tobj)        
        setObj(tobj)
    }
    useEffect(()=>{
        setObj(props.obj)
    },[props.obj])
    return <Box sx={{ p: 2 }}>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'backgroundColor')} value={obj && obj.backgroundColor?obj.backgroundColor:'#ffffff'} fullWidth label="Background color"/>
        {/* <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'height')} value={obj && obj.height?obj.height:'30px'} fullWidth label="Height (default 30px)"/>         */}
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'paddingLeft')} value={obj && obj.paddingLeft?obj.paddingLeft:'5px'} fullWidth label="Margin left"/>
        <TextField margin="normal" type="text" onChange={(e)=>handleChange(e,'paddingRight')} value={obj && obj.paddingRight?obj.paddingRight:'5px'} fullWidth label="Margin right"/>
    </Box>
}
export {
    EditForm,EditImage,EditUrl,EditButton,EditPanel
}