import {  Toolbar, Typography, Tooltip, Menu,  Divider, IconButton, Paper, Stack, MenuItem, ListItemIcon, ListItemText, } from "@mui/material"
import DownMenuItem from "./DownMenuItem"
import { useState } from "react";
import { SearchBar, SingleSelector } from "../../../Component/MuiEx";
import {   Add, Close, } from "@mui/icons-material";
const FamilyBar = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        props.children ?
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar style={{ paddingLeft: 2 }}>
                    {props.children}
                    <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div" ></Typography>
                    <Tooltip title="Filter">
                        <IconButton onClick={props.onCloseSecondBar} size="small"><Close fontSize="small" /></IconButton>
                    </Tooltip>
                </Toolbar>
            </Paper> :
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar style={{ paddingLeft: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }}>
                        {props.items && props.items.map((item, index) => {
                            return item.subItems ? <DownMenuItem key={index} icon={item.icon} onClick={item.onClick} items={item.subItems} text={item.text} /> :
                                <MenuItem key={index} onClick={item.onClick}>
                                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}<ListItemText>{item.text}</ListItemText>
                                </MenuItem>
                        })}
                    </Stack>
                    {props.onSearch && <><Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <SearchBar placeholder="name,email,phone" onSearch={props.onSearch} /></>}

                    <Typography sx={{ flex: '1 1 10%' }} variant="h6" component="div" > </Typography>
                    <SingleSelector name="showOption" items={['Pending','Active','Not active','Removed','All']} values={[0,1,2,-1,-2]} defaultValue={-2} onChange={props.onShowOption} />
                    <Tooltip title="Filter" sx={{ml:2}}>
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            aria-controls={open ? 'filter-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Add fontSize="small" />
                        </IconButton>
                    </Tooltip>
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
                        <MenuItem onClick={props.onImport}>
                            Import from file
                        </MenuItem>
                        <MenuItem onClick={props.onAdd}>
                            Add User
                        </MenuItem>

                    </Menu>
                </Toolbar>
            </Paper>
    )
}
export default FamilyBar