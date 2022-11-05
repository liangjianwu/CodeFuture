import { Toolbar, Paper, MenuItem, TextField, FormControl, InputLabel, Select, Button, Alert, Typography } from "@mui/material"
import { useState } from "react";
import { getCurrentMonth01 } from "../../../Utils/Common";

const CoachBar = (props) => {
    const [fields, setFields] = useState({ from: getCurrentMonth01(), to: new Date().toISOString().split('T')[0], coach: 0 })
    const [error, setError] = useState()
    const handleChange = (k, v) => {
        setFields({ ...fields, [k]: v })
    }
    const handleGo = () => {
        props.onSubmit && props.onSubmit(fields)
    }
    const showHours = (m)=>{        
        return Math.floor(m/60).toFixed(0) + 'h ' + m%60 + 'm'
    }
    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Toolbar style={{ paddingLeft: 2 }}>
                <FormControl sx={{ width: '200px', mr: 2 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Select Coach</InputLabel>
                    <Select labelId="demo-simple-select-autowidth-label"
                        onChange={(e) => { handleChange('coach', e.target.value) }}
                        label="Select Coach"
                        value={fields.coach}
                    >
                        <MenuItem key={'-1'} value={0}>{"All"}</MenuItem>
                        {props.coaches && props.coaches.map((p, idx) => {
                            return <MenuItem key={idx} value={p.id}>{p.name}</MenuItem>
                        })}

                    </Select>
                </FormControl>
                <FormControl sx={{ width: '200px', mr: 2 }}>
                    <TextField margin="normal" sx={{ mt: "8px" }} type="date" name="from" onChange={(e) => handleChange('from', e.target.value)} value={fields.from} id="from" label="From"
                        InputLabelProps={{ shrink: true }} />
                </FormControl>
                <FormControl sx={{ width: '200px', mr: 2 }}>
                    <TextField margin="normal" type="date" sx={{ mt: "8px" }} name="to" onChange={(e) => handleChange('to', e.target.value)} value={fields.to} id="to" label="to"
                        InputLabelProps={{ shrink: true }} />
                </FormControl>
                <Button variant='contained' onClick={handleGo}>Go</Button>
                <Typography sx={{flex:'1 1 10%'}}></Typography>
                <Typography sx={{mr:2}}>Total hours: <b>{showHours(props.total)}</b></Typography>
                <Typography >Private hours: <b>{showHours(props.totalPrivate)}</b></Typography>
            </Toolbar>
            {error && <Alert severity="error">{error}</Alert>}
        </Paper>
    )
}
export default CoachBar