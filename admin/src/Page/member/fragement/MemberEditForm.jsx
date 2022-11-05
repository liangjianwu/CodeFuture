import { Box, Checkbox, Button,FormControlLabel, TextField,Typography, Alert, } from "@mui/material"
import { useEffect, useState } from "react"
import apis from "../../../api"
import { MultiSelector, SingleSelector } from "../../../Component/MuiEx"
import { apiResult,  getUserSession } from "../../../Utils/Common"

const MemberEditForm = (props) => {       
    const [error,setError] = useState()
    getUserSession(apis)
    const [data,setData] = useState()
    const [struct,setStruct] = useState()    
    useEffect(() => {
        apis.getCustomer(props.id?props.id:0).then(ret => {
            apiResult(ret, (data) => {
                if(data.info) {
                    data.info.map(item=>{
                        data.member[item['key']] = item['value']
                        return true
                    })
                }                
                setData(data.member)
                setStruct(data.struct)
            }, setError)
        })
        return
    }, [])

    const onChange=(key,value)=>{  
        setError()                              
        setData({...data,[key]:value})
    }
    const handleSave = ()=>{    
        Object.keys(data).map(key=>{
            if(key !== 'id' && (!data[key] || data[key] == null)) {
                delete data[key]
            }
            return true
        })
        if(props.user_id>0) 
            data.user_id = props.user_id
        apis.editCustomer(data).then(ret=>{
            apiResult(ret,id=>{                
                if(data.id === 0) {
                    let dd = {...data}
                    dd.id = id               
                    setData(dd)
                    props.onClose && props.onClose(true)
                }else {
                    props.onClose && props.onClose(true)
                }
            },setError)
        })
    }
    return data && <Box sx={{ mt: 10 ,p:2,maxWidth:'500px'}}>
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
                    return <MultiSelector key={index1} label={subitem.label} items={subitem.options ? subitem.options.split(',') : []} values={subitem.options ? subitem.options.split(',') : []} defaultValue={data[subitem.name]} onChange={(name, value) => { onChange && onChange(subitem.name, value.toString()) }} />
                } else if (subitem.type === 'radio') {
                    return <SingleSelector key={index1} label={subitem.label} items={subitem.options ? subitem.options.split(',') : []} values={subitem.options ? subitem.options.split(',') : []} defaultValue={data[subitem.name]} onChange={(name, value) => { onChange && onChange(subitem.name, value) }} />
                } else if (subitem.type === 'date') {
                    return <TextField fullWidth key={index1}
                                margin="normal" type="date"
                                onChange={(e) => { onChange && onChange(subitem.name,e.target.value) }}
                                value={data[subitem.name]} label={subitem.label}
                                InputLabelProps={{ shrink: true }} />                    
                }else {
                    return <></>
                }
            })
        })}
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" sx={{mt:2,}} fullWidth onClick={handleSave}>Save</Button>
        <Button type="button" fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={() => { props.onClose && props.onClose(false) }}> Cancel </Button>
    </Box>
}
export default MemberEditForm