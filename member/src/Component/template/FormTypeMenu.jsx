import { Add,  Edit,  Remove } from "@mui/icons-material"
import { IconButton, Grid, Menu, MenuItem, ListItemIcon, TextField, Typography, } from "@mui/material"
import { useState } from 'react'
const FormTypeMenu = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (<><IconButton onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}>
        <Add />
    </IconButton>
        <Menu
            anchorEl={anchorEl}
            id="filter-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {props.onAdd && props.idx === undefined && <MenuItem onClick={() => { props.onAdd('section') }}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Section
            </MenuItem>}
            {props.onAdd && props.idx >= 0 && <MenuItem onClick={() => { props.onAdd('input', props.idx) }}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Input
            </MenuItem>}
            {props.onAdd && props.idx >= 0 && <MenuItem onClick={() => { props.onAdd('option', props.idx) }}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Option
            </MenuItem>}
            {props.onAdd && props.idx >= 0 && <MenuItem onClick={() => { props.onAdd('radio', props.idx) }}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Radio
            </MenuItem>}
            {props.onAdd && props.idx >= 0 && <MenuItem onClick={() => { props.onAdd('check', props.idx) }}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Check
            </MenuItem>}
            {props.onAdd && props.idx >= 0 && <MenuItem onClick={() => { props.onAdd('date', props.idx) }}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Date
            </MenuItem>}
            {props.onAdd && props.idx >= 0 && <MenuItem onClick={() => { props.onAdd('text', props.idx) }}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Text
            </MenuItem>}
        </Menu>
    </>)
}
const FormItem = (props) => {
    const handleFormChange = (k, v) => {
        let item = { ...props.item, [k]: v }
        props.onChange && props.onChange(item, props.idx)
    }
    return (
        <>
            {props.item && props.item.type === 'input' && <Grid container spacing={2}>
                <Grid item xs={1} justifyContent="center">
                    <Typography sx={{ marginTop: 4 }}>Input</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.name} onChange={(e) => handleFormChange('name', e.target.value)} fullWidth label="Field Name" />
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.label} onChange={(e) => handleFormChange('label', e.target.value)} fullWidth label="Field label" />
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={1}>
                    <IconButton sx={{ marginTop: 3 }} size={"small"} onClick={() => { props.onRemove && props.onRemove(props.item, props.idx) }}><Remove fontSize="small" /></IconButton>
                </Grid>
            </Grid>}
            {props.item && props.item.type === 'check' && <Grid container spacing={2}>
                <Grid item xs={1}>
                    <Typography sx={{ marginTop: 4 }}>Check</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.name} onChange={(e) => handleFormChange('name', e.target.value)} fullWidth label="Field Name" />
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.label} onChange={(e) => handleFormChange('label', e.target.value)} fullWidth label="Field label" />
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={1}>
                    <IconButton sx={{ marginTop: 3 }} size={"small"} onClick={() => { props.onRemove && props.onRemove(props.item, props.idx) }}><Remove fontSize="small" /></IconButton>
                </Grid>
            </Grid>}
            {props.item && props.item.type === 'radio' && <Grid container spacing={2}>
                <Grid item xs={1}>
                    <Typography sx={{ marginTop: 4 }}>Radio</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.name} onChange={(e) => handleFormChange('name', e.target.value)} fullWidth label="Field Name" />
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.label} onChange={(e) => handleFormChange('label', e.target.value)} fullWidth label="Field label" />
                </Grid>
                <Grid item xs={4}>
                    <TextField margin="normal" type="text" value={props.item.options} onChange={(e) => handleFormChange('options', e.target.value)} fullWidth label="Options (separated by ',') " />
                </Grid>
                <Grid item xs={1}>
                    <IconButton sx={{ marginTop: 3 }} size={"small"} onClick={() => { props.onRemove && props.onRemove(props.item, props.idx) }}><Remove fontSize="small" /></IconButton>
                </Grid>
            </Grid>}
            {props.item && props.item.type === 'option' && <Grid container spacing={2}>
                <Grid item xs={1}>
                    <Typography sx={{ marginTop: 4 }}>Option</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.name} onChange={(e) => handleFormChange('name', e.target.value)} fullWidth label="Field Name" />
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.label} onChange={(e) => handleFormChange('label', e.target.value)} fullWidth label="Field label" />
                </Grid>
                <Grid item xs={4}>
                    <TextField margin="normal" type="text" value={props.item.options} onChange={(e) => handleFormChange('options', e.target.value)} fullWidth label="Options (separated by ',') " />
                </Grid>
                <Grid item xs={1}>
                    <IconButton sx={{ marginTop: 3 }} size={"small"} onClick={() => { props.onRemove && props.onRemove(props.item, props.idx) }}><Remove fontSize="small" /></IconButton>
                </Grid>
            </Grid>}
            {props.item && props.item.type === 'date' && <Grid container spacing={2}>
                <Grid item xs={1}>
                    <Typography sx={{ marginTop: 4 }}>Date</Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.name} onChange={(e) => handleFormChange('name', e.target.value)} fullWidth label="Field Name" />
                </Grid>
                <Grid item xs={3}>
                    <TextField margin="normal" type="text" value={props.item.label} onChange={(e) => handleFormChange('label', e.target.value)} fullWidth label="Field label" />
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={1}>
                    <IconButton sx={{ marginTop: 3 }} size={"small"} onClick={() => { props.onRemove && props.onRemove(props.item, props.idx) }}><Remove fontSize="small" /></IconButton>
                </Grid>
            </Grid>}
            {props.item && props.item.type === 'text' && <Grid container spacing={2}>
                <Grid item xs={1}>
                    <Typography sx={{ marginTop: 4 }}>Text</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField margin="normal" multiline type="text" value={props.item.name} onChange={(e) => handleFormChange('label', e.target.value)} fullWidth label="Text Description" />
                </Grid>                
                <Grid item xs={1}>
                    <IconButton sx={{ marginTop: 3 }} size={"small"} onClick={() => { props.onRemove && props.onRemove(props.item, props.idx) }}><Remove fontSize="small" /></IconButton>
                </Grid>
            </Grid>}
        </>
    )
}

export {
    FormTypeMenu, FormItem
}