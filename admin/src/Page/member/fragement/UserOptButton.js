import { Add,  Delete,  Edit,  MoreHoriz, Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton,Menu,MenuItem,ListItemIcon } from "@mui/material"
import {useState} from 'react'
const UserOptButton = (props) => {
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
        <MoreHoriz />
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
            <MenuItem onClick={()=>{props.onEdit && props.onEdit(props.id,props.index)}}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Edit
            </MenuItem>
            <MenuItem onClick={()=>{props.onAddKids && props.onAddKids(props.id,props.index)}}>
                <ListItemIcon>
                    <Add fontSize="small" />
                </ListItemIcon>
                Add Kids
            </MenuItem>
            {props.onPending && <MenuItem onClick={()=>{props.onPending && props.onPending(props.id,props.index)}}>
                <ListItemIcon>
                    <VisibilityOff fontSize="small" />
                </ListItemIcon>
                Pending
            </MenuItem>}
            {props.onActive && <MenuItem onClick={()=>{props.onActive && props.onActive(props.id,props.index)}}>
                <ListItemIcon>
                    <Visibility fontSize="small" />
                </ListItemIcon>
                Active
            </MenuItem>}
            {props.onInActive && <MenuItem onClick={()=>{props.onInActive && props.onInActive(props.id,props.index)}}>
                <ListItemIcon>
                    <VisibilityOff fontSize="small" />
                </ListItemIcon>
                Not active
            </MenuItem>}
            {props.onDelete && <MenuItem onClick={()=>{props.onDelete && props.onDelete(props.id,props.index)}}>
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                Remove
            </MenuItem>}
            {props.onOrders && <MenuItem onClick={()=>{props.onOrders && props.onOrders(props.id,props.index)}}>
                <ListItemIcon>
                    <Visibility fontSize="small" />
                </ListItemIcon>
                Family Transactions
            </MenuItem>}
        </Menu>
    </>)
}
export default UserOptButton