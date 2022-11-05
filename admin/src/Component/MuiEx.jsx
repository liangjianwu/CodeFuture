import {IconButton, Button, Alert, Paper, FormControlLabel, TextField, Box, InputBase, Radio, Checkbox, FormControl, InputLabel, OutlinedInput, InputAdornment, Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import PropTypes from 'prop-types';
import SearchIcon from "@mui/icons-material/Search";
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { Visibility, VisibilityOff,SettingsAccessibility,AccountCircle,PersonOutline,AssignmentInd } from "@mui/icons-material"
const ResendButton = (props) => {
    const [resetCount, setCount] = useState(props.count)
    const [disabled, setDisabled] = useState(props.disabled)
    const [txt, setText] = useState(props.disabled ? props.txt2 : props.txt1)
    let start = undefined
    const countRef = useRef(resetCount)
    const count = () => {
        countRef.current -= 1
        setCount(countRef.current)
        if (countRef.current <= 0) {
            setDisabled(false)
            countRef.current = props.count
            setCount(countRef.current)
            setText(props.txt1)
            start = undefined
        } else {
            clearTimeout(start)
            start = setTimeout(count, 1000)
        }
    }
    const clickCallback = () => {
        setDisabled(true)
        setText(props.txt2)
        countRef.current = props.count
        setCount(countRef.current)
        count()
    }
    const handleClick = (e) => {
        e.preventDefault();
        props.onClick(e, clickCallback)
    }
    useEffect(() => {
        if (disabled && !start) {
            start = setTimeout(count, 1000)
        }
    }, [])
    return (
        <Button size={props.size} onClick={handleClick} disabled={disabled}>{txt}{disabled ? ("(" + resetCount + ")") : ""}</Button>
    )
}
const EditableTextView = (props) => {
    const [disabled, setDisabled] = useState(true)
    const [value, setValue] = useState(props.defaultValue)
    const handleEdit = (e) => {
        setDisabled(!disabled)
    }
    const handleChange = (e) => {
        setValue(e.target.value)
        props.onChange && props.onChange(props.values ?props.values[e]:e)
    }
    return (
        <Box component="div" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: props.width }}>
            {disabled ? <InputBase onClick={handleEdit}
                sx={{ ml: 1, flex: 1, color: '#888' }}
                value={value}
                onFocus={handleEdit}
                placeholder={props.placeholder}
            /> : <TextField autoFocus fullWidth onBlur={(e) => {
                setDisabled(true)
                props.onSubmit && props.onSubmit(e)
            }} variant="outlined" placeholder={props.placeholder} defaultValue={value} onChange={handleChange} />}
        </Box>
    )
}
const GenderSelector = (props) => {
    const [selected, setSelected] = useState(Number(props.defaultValue))
    const handleChange = (idx) => {
        setSelected(idx)
        props.onChange && props.onChange(idx)
    }
    return (<div>
        <FormControlLabel onChange={() => handleChange(0)} label="Female" control={<Radio checked={selected === 0} onChange={() => handleChange(0)} />} />
        <FormControlLabel onChange={() => handleChange(1)} label="Male" control={<Radio checked={selected === 1} onChange={() => handleChange(1)} />} />        
    </div>)
}
const SingleSelector = (props) => {
    const [selected, setSelected] = useState(Number(props.defaultValue))
    useEffect(()=>{
        setSelected(props.defaultValue)
    },[props.defaultValue])
    const handleChange = (idx) => {
        setSelected(props.values ? props.values[idx]:idx)
        props.onChange && props.onChange(props.name,props.values?props.values[idx]:idx)
    }
    return (<Stack direction={"row"} sx={{...props.sx}}>
        {props.label && <Typography sx={{mr:2,mt:1}}>{props.label}</Typography>}
        {props.items && props.items.map((item,index)=>{            
            const isSelected = (props.values?(props.values[index] == selected):(selected == index))            
            return <FormControlLabel key={index} onChange={() => handleChange(index)} label={item} control={<Radio checked={isSelected} onChange={() => handleChange(index)} />} />    
        })}
    </Stack>)
}
const SingleOptionList = (props) => {
    const [selected, setSelected] = useState(Number(props.defaultValue))
    useEffect(()=>{
        setSelected(props.defaultValue)
    },[props.defaultValue])
    const handleChange = (idx) => {
        setSelected(props.values ? props.values[idx]:idx)
        props.onChange && props.onChange(props.name,props.values?props.values[idx]:idx)
    }
    return (<Stack direction={"column"} sx={{...props.sx}}>
        {props.label && <Typography sx={{mr:2,mt:1}}>{props.label}</Typography>}
        {props.items && props.items.map((item,index)=>{            
            const isSelected = (props.values?(props.values[index] == selected):(selected == index))            
            return <FormControlLabel key={index} onChange={() => handleChange(index)} label={item} control={<Radio checked={isSelected} onChange={() => handleChange(index)} />} />    
        })}
    </Stack>)
}
const MultiSelector = (props) => {
    const [selected, setSelected] = useState(props.defaultValue?props.defaultValue:[])
    useEffect(()=>{
        setSelected(props.defaultValue)
    },[props.defaultValue])

    const handleChange = (idx) => {
        const t = selected ? [...selected]:[]
        const p = t.indexOf(props.values ? props.values[idx]:idx)
        if(p>=0) {
            t.splice(p,1)
        }else {
            t.push(props.values ? props.values[idx]:idx)
        }
        setSelected(t)
        props.onChange && props.onChange(props.name,t)
    }
    return (<div sx={{...props.sx}}>
        {props.label && <Typography>{props.label}</Typography>}
        {props.items && props.items.map((item,index)=>{            
            const isSelected = selected && selected.indexOf(props.values ? props.values[index]:index) !== -1
            return <FormControlLabel key={index} onChange={() => handleChange(index)} label={item} control={<Checkbox checked={isSelected} onChange={() => handleChange(index)} />} />    
        })}
    </div>)
}
const Title = (props) => {
    return (
        <Typography component="h2" variant="h6" color="primary" sx={props.sx} gutterBottom>
            {props.children}
        </Typography>
    );
}
Title.propTypes = {
    children: PropTypes.node,
};
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const drawWidth=240
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawWidth,
        width: `calc(100% - ${drawWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.down('lg')]: {
                    width: 0,//theme.spacing(9),
                },
            }),
        },
    }),
);
const RightDrawer = (props)=>{  
    const handleClose = ()=>{
        props.toggleDrawer && props.toggleDrawer()
    }
    return (<MuiDrawer anchor={'right'} sx={props.sx} onClose={handleClose} open={props.open}>
        {props.children}
    </MuiDrawer>)
}
const NoData = (props)=>{
    return (<Alert severity={"info"}>{props.text}</Alert>)
}
const SearchBar = (props)=>{
    return (<Box component="form" onSubmit={props.onSearch} sx={{ p: '2px 4px', display: 'flex',minWidth:200, alignItems: 'center' }} >
    <TextField
        sx={{ ml: 1, flex: 1,minWidth:'160px' }}
        placeholder={props.placeholder}
        name="value"
        id="value"
        fullWidth
        variant="standard"        
    />
    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
    </IconButton>
</Box>)
}

const PasswordTextField = (props)=>{
    const [showPassword, setShowPassword] = useState(false);
    
      const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
      };    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    return <FormControl sx={props.sx} variant="outlined">
          <InputLabel htmlFor={props.id?props.id:"outlined-adornment-password"}>{props.label}</InputLabel>
          <OutlinedInput
            id={props.id?props.id:"outlined-adornment-password"}
            name={props.name}                        
            error={props.error}
            helpText = {props.helpText}
            type={showPassword ? 'text' : 'password'}
            value={props.value}
            defaultValue={props.defaultValue}
            required={props.required}
            onChange={props.onChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={props.label}
          />
        </FormControl>
}

const MemberStatus = (statuscode)=>{
    const icons = [<SettingsAccessibility fontSize="small"/>,<AccountCircle  fontSize="small"/>,<PersonOutline  fontSize="small"/>,<AssignmentInd  fontSize="small"/>]
    const colors = ['#000a','#059','#059','#0005',]
    const status = ['Guest','Member','Temporary member','Freeze member']
    return {icon:icons[statuscode],color:colors[statuscode],status:status[statuscode]}
}
const MemberLevel = (level) =>{
    const levels = ['Baby','Beginner','Intermediate1','Intermediate2','Competitive','Adult']
    const label = ['B1','B2','M1','M2','C','A']
    const colors = ['#93e889','#228517','#5886db','#335491','#102447','#d97b0f']
    return {color:colors[level],level:levels[level],label:label[level]?label[level]:''}
}
const MemberLevelOption = ()=>{
    return {
        levels:['Baby','Beginner','Intermediate1','Intermediate2','Competitive','Adult'],
        values:[0,1,2,3,4,5]
    }
}
export { ResendButton, EditableTextView, GenderSelector, Title, Item ,Drawer,AppBar,RightDrawer,NoData,SingleSelector,SingleOptionList,SearchBar,MultiSelector,PasswordTextField,MemberStatus,MemberLevel,MemberLevelOption}