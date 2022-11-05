import { Paper,  TextField, Box, Typography,  FormControlLabel, Checkbox } from "@mui/material"
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { MultiSelector, SingleSelector } from "../MuiEx";
import { formatDate } from "../../Utils/Common"
const FormGenerator = (props) => {
    const {form,onChange,title} = props
    return (<Box>
        {title && <Typography sx={{ flex: '1 1 100%' }} component="div" >{title}</Typography>}
        {form && form.map((item, index) => {
            return <Paper key={index} sx={{ padding: 2, marginTop: 2 }}>
                <Typography sx={{ flex: '1 1 100%' }} variant='overline' component="div" ><div style={{ width: "100%", }} dangerouslySetInnerHTML={{ __html: item.label }}></div></Typography>
                {item.items.map((subitem, index1) => {
                    if (subitem.type === 'text') {
                        return <Typography key={index1} component="div" variant="body1" ><div style={{ width: "100%", }} dangerouslySetInnerHTML={{ __html: subitem.label }}></div></Typography>
                    } else if (subitem.type === 'input') {
                        return <TextField key={index1} margin="normal" fullWidth label={subitem.label} defaultValue={subitem.value} onChange={(e)=>{onChange && onChange(index,index1,e.target.value)}}/>
                    } else if (subitem.type === 'check') {
                        return <FormControlLabel key={index1} control={<Checkbox color="primary" defaultChecked={subitem.value} onChange={(e)=>{onChange && onChange(index,index1,!subitem.value)}} />} label={subitem.label} />
                    } else if (subitem.type === "option") {
                        return <MultiSelector key={index1} label={subitem.label} items={subitem.options ? subitem.options.split(',') : []} values={subitem.options ? subitem.options.split(',') : []} defaultValue={subitem.value} onChange={(name,value)=>{onChange && onChange(index,index1,value)}}/>
                    } else if (subitem.type === 'radio') {
                        return <SingleSelector key={index1} label={subitem.label} items={subitem.options ? subitem.options.split(',') : []} values={subitem.options ? subitem.options.split(',') : []} defaultValue={subitem.value} onChange={(name,value)=>{onChange && onChange(index,index1,value)}}/>
                    } else if (subitem.type === 'date') {
                        return <LocalizationProvider key={index1} dateAdapter={AdapterDateFns} margin="normal" >
                            <DatePicker
                                label={subitem.label}
                                value={subitem.value && (subitem.value + " 12:00:00")}
                                onChange={(newdate)=>{console.log(newdate);onChange && onChange(index,index1,formatDate(newdate))}}
                                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                        </LocalizationProvider>
                    }
                })}
            </Paper>
        })}</Box>)
}

export default FormGenerator