import { useState } from 'react';
import { Typography, Avatar, Autocomplete, Select, Container, CssBaseline, FormControl, InputLabel, MenuItem, Alert, TextField, Button, Box, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { apiResult, formToJson, getUserSession, } from '../../../Utils/Common';
import apis from '../../../api';
import { MemberLevel, MultiSelector } from '../../../Component/MuiEx';

const EditSchedule = (props) => {
    let { products, members, onAfterEdit, onClose } = props
    const [error, setError] = useState()
    const [field, setField] = useState({})
    getUserSession(apis)
    const handleSubmit = async () => {
        setError()
        let wods = field.wods
        let members = field.members
        if (!wods || wods.length == 0) {
            setError("You need to select one day of week")
            return
        }
        if (!field.begintime) {
            setError("You need to set the start time")
            return
        }
        if (!field.duration || field.duration < 5) {
            setError("You need to set minutes (multiple of 15 minutes)")
            return
        }
        if(Number(field.begintime) + Number(field.duration) > 1380) {
            setError('Time is over than 23:00')
            return
        }
        if (field.product_id > 0 && field.coach_id > 0) {
            console.log(field.product_id)
        } else {
            setError("Please select a course")
        }
        // let rets = []
        // let errors = []
        // for (let i = 0; i < wods.length; i++) {
        //     let data = { ...field, wod: wods[i] }
        //     if (members && members.length > 0) {
        //         for (let j = 0; j < members.length; j++) {
        //             let data1 = { ...data, member_id: members[j] }
        //             delete data1['wods']
        //             delete data1['members']
        //             try {
        //                 let ret = await apis.editSchedule(data1)
        //                 apiResult(ret, data => {
        //                     data1.id = data
        //                     rets.push(data1)
        //                 }, err => {                            
        //                     errors.push(err.message)
        //                 })                        
        //             } catch (e) {                        
        //                 errors.push(e.message)
        //             }
        //         }
        //     } else {
        //         delete data['wods']
        //         delete data['members']
        //         try {
        //             let ret = await apis.editSchedule(data)
        //             apiResult(ret, rdata => {
        //                 data.id = rdata
        //                 rets.push(data)
        //             }, err => {                        
        //                 errors.push(err)
        //             })                    
        //         } catch (e) {                    
        //             errors.push(e.message)
        //         }
        //     }            
        // }
        // if(errors.length>0) {
        //     setError(JSON.stringify(errors))
        // }else {
        //     onAfterEdit && onAfterEdit(rets)
        // }
        apis.addSchedule(field).then(ret=>{
            apiResult(ret,data=>{
                onAfterEdit(data)
            },setError)
        })
    }
    const handleChange = (k, v) => {
        setField({ ...field, [k]: v })
    }
    const timeToMinutes = (v) =>{
        let t = v.split(':')
        if(t.length == 2) {
            return Number(t[0])*60 + Number(t[1])
        }else {
            return 0
        }
    }
    return <><Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
            <Typography component="h1" variant="h5"> Add & Edit Schedule </Typography>
            <Box sx={{ mt: 5 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-autowidth-label">Select course</InputLabel>
                    <Select labelId="demo-simple-select-autowidth-label"
                        id="product"
                        onChange={(e) => { let idx = e.target.value; setField({ ...field, product_id: products[idx].id, coach_id: products[idx].coach_id }); }}
                        label="Select product"                        
                    >
                        {products && products.map((p, idx) => {
                            return p.coach_id > 0 ? <MenuItem key={idx} value={idx}>{p.name}</MenuItem> : null
                        })}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <Autocomplete disablePortal id="customer-selector"
                        options={members}
                        autoComplete
                        autoHighlight
                        multiple={true}
                        autoSelect
                        getOptionLabel={(option) => MemberLevel(option.level).label +"-" + option.name + "-" + option.id}
                        onChange={(e, v) => {
                            const values = []
                            v.map((item => {
                                typeof item === "string" ? values.push(item) : values.push(item.id)
                            }))
                            handleChange('members', values)
                        }}
                        renderInput={(params) => <TextField {...params} label="Member" />}
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>
                <TextField margin="normal" type="date" name="from" onChange={(e) => { handleChange('from', e.target.value) }} fullWidth label="From" InputLabelProps={{ shrink: true }} />
                <TextField margin="normal" type="date" name="to" onChange={(e) => { handleChange('to', e.target.value) }} fullWidth label="To" InputLabelProps={{ shrink: true }} />
                <MultiSelector items={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']} values={[0, 1, 2, 3, 4, 5, 6]} name="wods" onChange={handleChange} label="Day of week" />
                <TextField fullWidth margin="normal" type="time" min="06:00" max="22:00" name="begintime" onChange={(e) => { handleChange('begintime', timeToMinutes(e.target.value)) }} label="Start time" InputLabelProps={{ shrink: true }} />
                <TextField fullWidth margin="normal" type="number" name="minutes" onChange={(e) => { handleChange('duration', e.target.value) }} label="Minutes" />
                {error && <Alert severity="error">{error}</Alert>}
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit} >Add</Button>
                <Button fullWidth variant="outlined" onClick={() => { onClose && onClose(false) }} sx={{ mb: 2 }} > Cancel </Button>
            </Box>
        </Box>
    </Container></>
}

export default EditSchedule