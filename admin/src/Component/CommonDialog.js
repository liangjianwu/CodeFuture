import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Dialog, Alert } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


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

const CommonDialog = (props) => {
    const { onClose, onSubmit, dialogTitle, errorHint } = props
    return <BootstrapDialog
        onClose={props.onClose}
        aria-labelledby="customized-dialog-title1"
        open={true}        
    >
        <BootstrapDialogTitle id="customized-dialog-title1" onClose={onClose}>
            {dialogTitle}
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{minWidth:'300px'}}>
            {errorHint && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }}>{errorHint}</Alert>}
            {props.children}
        </DialogContent>
        <DialogActions>
            {onClose && <Button onClick={onClose}>Cancel</Button>}
            {onSubmit && <Button autofocus onClick={onSubmit}>Ok</Button>}
        </DialogActions>
    </BootstrapDialog>
}
export default CommonDialog