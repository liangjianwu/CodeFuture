import { Box, Checkbox, Button,FormControlLabel, TextField,Typography,Alert, } from "@mui/material"
import { useEffect, useState } from "react"
import apis from "../../api"
import { MultiSelector, SingleSelector } from "../../Component/MuiEx"
import { apiResult,  getUserSession } from "../../Utils/Common"

const KidForm = (props) => {        
    const {onSave,struct } = props    
    const [saving,setSaving] = useState(false)
    const [error,setError] = useState()
    getUserSession(apis)
    const [data,setData] = useState()
    const onChange=(key,value)=>{  
        setError()                              
        setData({...data,[key]:value})
    }
    const handleSave = ()=>{    
        if(saving) return
        Object.keys(data).map(key=>{
            if(!data[key] || data[key] == null) {
                delete data[key]
            }
        })    
        setError()
        setSaving(true)
        apis.editKidProfile(data).then(ret=>{
            apiResult(ret,id=>{                           
                if(!data.id || data.id == 0) {
                    let dd = {...data}
                    dd.id = id               
                    setData(dd) 
                    onSave && onSave(dd)
                }else {
                    onSave && onSave(data)
                }                
            },setError)
            setSaving(false)
        })
    }
   
    useEffect(()=>{        
        setData(props.data?props.data:{id:0})
    },[props.data])
    return data && <Box sx={{ mt: 2 ,maxWidth:'600px'}}>
        {props.title && <Typography variant="h4">{props.title}</Typography>}
        {struct.map((section, index) => {            
            return section.items.map((subitem, index1) => {                
                if (subitem.type === 'text') {
                    return <Typography key={index1} component="div" variant="body1" ><div style={{ width: "100%", }} dangerouslySetInnerHTML={{ __html: subitem.label }}></div></Typography>
                } else if (subitem.type === 'input') {
                    return <TextField key={index1} margin="normal" fullWidth label={subitem.label} value={data[subitem.name]} onChange={(e) => { onChange && onChange(subitem.name, e.target.value) }} />
                } else if (subitem.type === 'check') {
                    return <FormControlLabel key={index1} control={<Checkbox color="primary" defaultChecked={data[subitem.name]} onChange={(e) => { onChange && onChange(subitem.name, !data[subitem.name]) }} />} label={subitem.label} />
                } else if (subitem.type === "option") {
                    return <MultiSelector key={index1} label={subitem.label} items={subitem.options ? subitem.options.split(',') : []} values={subitem.options ? subitem.options.split(',') : []} defaultValue={data[subitem.name]} onChange={(name, value) => { onChange && onChange(subitem.name, value) }} />
                } else if (subitem.type === 'radio') {
                    return <SingleSelector key={index1} label={subitem.label} items={subitem.options ? subitem.options.split(',') : []} values={subitem.options ? subitem.options.split(',') : []} defaultValue={data[subitem.name]} onChange={(name, value) => { onChange && onChange(subitem.name, value) }} />
                } else if (subitem.type === 'date') {
                    return <TextField key={index1} type="date" margin="normal" InputLabelProps={{ shrink: true }} fullWidth label={subitem.label} value={data[subitem.name]} onChange={(e) => { onChange && onChange(subitem.name, e.target.value) }} />
                    {/* return <LocalizationProvider key={index1} dateAdapter={AdapterDateFns} margin="normal" >
                        <DatePicker
                            label={subitem.label}
                            value={data[subitem.name] && (data[subitem.name] + " 12:00:00")}
                            onChange={(newdate) => { console.log(newdate); onChange && onChange(subitem.name, formatDate(newdate)) }}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </LocalizationProvider> */}
                }
            })
        })}
        {error && <Alert severity="error">{error}</Alert>}
        <Button disabled={saving} variant="contained" sx={{mt:2,}} fullWidth onClick={handleSave}>{data.id === 0?"Save":"Update"}</Button>
        
    </Box>
}
export default KidForm