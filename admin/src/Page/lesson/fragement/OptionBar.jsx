import {  Toolbar, Typography,   Divider, IconButton,  } from "@mui/material"
import {AddCard, ArrowBack, ArrowForward,  Logout, PlaylistAdd, Remove, Save} from '@mui/icons-material';
const OptionBar = (props) => {
    const {onRight,onLeft,onAdd,onAddChild,onSave,onRemove,onClose} = props
    return <Toolbar style={{ paddingLeft: 2,marginLeft:-16,minHeight:'32px',background:'#ccca'}}>        
            {onLeft && <IconButton   onClick={onLeft}>
                <ArrowBack />                
            </IconButton>}
            {onRight && <><Divider variant="middle" orientation="vertical" flexItem></Divider>
            <IconButton   onClick={onRight}>                
                <ArrowForward />                
            </IconButton></>}
            <Typography sx={{ flex: '1 1 10%' }} variant="h6" component="div" > </Typography>
            {onAdd && <IconButton   title={"Add Content"} onClick={onAdd}>                
                <AddCard />                
            </IconButton>}
            {onAddChild && <><Divider variant="middle" orientation="vertical" flexItem></Divider>
            <IconButton   title={"Add sub-content"} onClick={onAddChild}>                
                <PlaylistAdd />                
            </IconButton></>}            
            {onRemove && <><Divider variant="middle" orientation="vertical" flexItem></Divider>
            <IconButton   title={"Remove the content"} onClick={onRemove}>                
                <Remove />                
            </IconButton></>}     
            
            <Typography sx={{ flex: '1 1 10%' }} variant="h6" component="div" > </Typography>
            {onSave && <IconButton   title={"Save"} onClick={onSave}>                
                <Save />                
            </IconButton>}      
            {onClose && <><Divider variant="middle" orientation="vertical" flexItem></Divider>
            <IconButton   title={"Close"} onClick={onClose}>                
                <Logout />                
            </IconButton></>}
    </Toolbar>
}
export default OptionBar