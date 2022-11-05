import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Dialog, Box, FormControl, InputLabel, Select, MenuItem, Autocomplete } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { MemberLevel, SingleSelector } from '../../../Component/MuiEx';
import { useState } from 'react';
import { TextField } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const DeleteScheduleDialog = (props) => {
    const [choice, setChoice] = useState(-1)
    return <BootstrapDialog
        onClose={props.onClose}
        aria-labelledby="customized-dialog-title"
        open={true}
    >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={props.onClose}>
            Delete Schedule
        </BootstrapDialogTitle>
        <DialogContent dividers>
            <Typography gutterBottom>
                Are you sure to delete?
            </Typography>
            <SingleSelector label={'Apply to:'} items={['Current date', 'After this date', 'All']} values={[0, 1, 2]} name="deleteOption" onChange={(n, v) => { setChoice(v) }}></SingleSelector>
        </DialogContent>
        <DialogActions>
            {props.onClose && <Button autoFocus onClick={props.onClose}>
                Cancel
            </Button>}
            {props.onSubmit && <Button autoFocus onClick={() => choice>=0 && props.onSubmit(choice)}>
                Ok
            </Button>}
        </DialogActions>
    </BootstrapDialog>
}
const EditScheduleDialog = (props) => {
    const { schedule, onClose, onSubmit, products, members, } = props
    const [field, setField] = useState({id:schedule.id,type:schedule.type,option:-1})
    const time = (Math.floor(Number(schedule.begintime) / 60) < 10 ? ('0' + Math.floor(Number(schedule.begintime) / 60)) : Math.floor(Number(schedule.begintime) / 60)) + ':' + (Number(schedule.begintime) % 60 < 10 ? ('0' + Number(schedule.begintime) % 60) : Number(schedule.begintime) % 60) 
    const timeToMinutes = (v) => {
        let t = v.split(':')
        if (t.length == 2) {
            return Number(t[0]) * 60 + Number(t[1])
        } else {
            return 0
        }
    }
    const handleSubmit = ()=>{
        
        field.option >= 0 && onSubmit && onSubmit(field)
    }
    const getProductIdx = (id)=>{
        for(let i=0;i<products.length;i++) {
            if(products[i].id == id) return i;
        }
        return -1
    }
    return <BootstrapDialog
        onClose={props.onClose}
        aria-labelledby="customized-dialog-title"
        open={true}
    >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={props.onClose}>
            Edit Schedule
        </BootstrapDialogTitle>


        <DialogContent dividers>
            <Box sx={{ p: 2 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-autowidth-label">Change course</InputLabel>
                    <Select labelId="demo-simple-select-autowidth-label"
                        id="product"
                        onChange={(e) => { let idx = e.target.value; setField({ ...field, product_id: products[idx].id, coach_id: products[idx].coach_id }); }}
                        label="Change product"
                        defaultValue={getProductIdx(schedule.product_id)}
                    >
                        {products && products.map((p, idx) => {
                            return p.coach_id > 0 ? <MenuItem key={idx} value={idx}>{p.name}</MenuItem> : null
                        })}
                    </Select>
                </FormControl>
                {schedule.type != 'member' && <FormControl fullWidth sx={{ mt: 2 }}>
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
                            setField({ ...field, members: values })
                        }}
                        renderInput={(params) => <TextField {...params} label="Add more member" />}
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>}                
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <TextField label="Time" margin={"normal"} defaultValue={time} type='time' onChange={(e) => { setField({ ...field, begintime: timeToMinutes(e.target.value) }) }} />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <TextField label="Duration" margin={"normal"} defaultValue={schedule.duration} type='number' onChange={(e) => { setField({ ...field, duration: Number(e.target.value) }) }} />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <SingleSelector label="Apply to" items={['Current date', 'After this date', 'All']} values={[0, 1, 2]} name="editOption" onChange={(n, v) => { setField({...field,option:v}) }}></SingleSelector>
                </FormControl>
            </Box>

        </DialogContent>
        <DialogActions>
            {onClose && <Button autoFocus onClick={onClose}>
                Cancel
            </Button>}
            {onSubmit && <Button autoFocus onClick={() => handleSubmit()}>
                Ok
            </Button>}
        </DialogActions>
    </BootstrapDialog>
}

export { DeleteScheduleDialog, EditScheduleDialog }