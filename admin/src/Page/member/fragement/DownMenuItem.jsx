import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ListItemText,Typography,ListItemIcon, } from '@mui/material';
export default function DownMenuItem(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleItemClick = (item) => {
        handleClose()
        item.onClick && item.onClick(item)
    }

    return (
        <div>
            <MenuItem
                id="basic-button"
                aria-controls={Boolean(anchorEl) ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                onClick={handleClick}
                sx={{minWidth:0}}
            >   {props.icon && <ListItemIcon sx={{minWidth:"0 !important"}}>
                    <Button size='small' sx={{p:0,minWidth:'0'}} variant="outlined">{props.icon}</Button>
                </ListItemIcon>}
                {(props.text || props.text.length>0) && <ListItemText>
                    {props.text}
                </ListItemText>}
                {(props.text || props.text.length>0) &&<Typography variant="body2" color="text.secondary">
                    <ArrowDropDownIcon />
                </Typography>}

            </MenuItem>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >{props.items && props.items.map((item, index) => {
                return <MenuItem key={index} onClick={() => { handleItemClick(item) }}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText>
                        {item.text}
                    </ListItemText>
                </MenuItem>
            })}
            </Menu>
        </div>
    );
}
