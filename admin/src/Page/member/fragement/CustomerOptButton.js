import {  Delete, Edit, HideSource, List, MoreHoriz, Visibility, VisibilityOff,SettingsAccessibility,AccountCircle,PersonOutline,AssignmentInd } from "@mui/icons-material"
import { IconButton,Menu,MenuItem,ListItemIcon } from "@mui/material"
import {useState} from 'react'
const CustomerOptButton = (props) => {
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
                Edit Profile
            </MenuItem>
            
            {props.onNonMember && <MenuItem onClick={()=>{props.onNonMember && props.onNonMember(props.id,props.index)}}>
                <ListItemIcon>
                    <SettingsAccessibility fontSize="small" />
                </ListItemIcon>
                Guest
            </MenuItem>}
            {props.onMember && <MenuItem onClick={()=>{props.onMember && props.onMember(props.id,props.index)}}>
                <ListItemIcon>
                    <AccountCircle fontSize="small" />
                </ListItemIcon>
                Member
            </MenuItem>}
            {props.onTempMember && <MenuItem onClick={()=>{props.onTempMember && props.onTempMember(props.id,props.index)}}>
                <ListItemIcon>
                    <PersonOutline fontSize="small" />
                </ListItemIcon>
                Temporary Member
            </MenuItem>}
            {props.onDormant && <MenuItem onClick={()=>{props.onDormant && props.onDormant(props.id,props.index)}}>
                <ListItemIcon>
                    <AssignmentInd fontSize="small" />
                </ListItemIcon>
                Freeze Member
            </MenuItem>}
            <MenuItem onClick={()=>{props.onDetail && props.onDetail(props.id,props.index)}}>
                <ListItemIcon>
                    <List fontSize="small" />
                </ListItemIcon>
                Member Transactions
            </MenuItem>
        </Menu>
    </>)
}
export default CustomerOptButton