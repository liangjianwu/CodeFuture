import { AddCard, ArrowBackIosNew, ContentPasteGo, Edit, MoreHoriz, Receipt, SettingsBackupRestore } from "@mui/icons-material"
import { IconButton,Menu,MenuItem,ListItemIcon } from "@mui/material"
import {useState} from 'react'
const TransactionOptButton = (props) => {
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
            {props.onTransactionHistory && <MenuItem onClick={()=>{props.onTransactionHistory(props.id,props.index)}}>
                <ListItemIcon>
                    <AddCard fontSize="small" />
                </ListItemIcon>
                Family Transactions
            </MenuItem>}
            {props.onKidTransactionHistory && <MenuItem onClick={()=>{props.onKidTransactionHistory(props.id,props.index)}}>
                <ListItemIcon>
                    <AddCard fontSize="small" />
                </ListItemIcon>
                Member Transactions
            </MenuItem>}
            {props.onEdit &&<MenuItem onClick={()=>{props.onEdit && props.onEdit(props.id,props.index)}}>
                <ListItemIcon>
                    <Receipt fontSize="small" />
                </ListItemIcon>
                Edit Transaction
            </MenuItem>   }         
            <MenuItem onClick={()=>{props.onRefund && props.onRefund(props.id,props.index)}}>
                <ListItemIcon>
                    <SettingsBackupRestore fontSize="small" />
                </ListItemIcon>
                Refund
            </MenuItem>
            {props.onCancel &&<MenuItem onClick={()=>{props.onCancel && props.onCancel(props.id,props.index)}}>
                <ListItemIcon>
                    <SettingsBackupRestore fontSize="small" />
                </ListItemIcon>
                Cancel Tranaction
            </MenuItem>}
        </Menu>
    </>)
}
export default TransactionOptButton