import { useEffect, useState } from "react"
import apis from "../../../api"
import { apiResult, formToJson, getUserSession } from "../../../Utils/Common"
import { Container, ListItemAvatar, CssBaseline, List, Paper, ListItem,  ListItemText, InputBase, Divider, Button,  Grid, Box, Checkbox, Typography, Alert,  Radio } from '@mui/material';
import { Folder } from "@mui/icons-material";
import { NoData } from "../../../Component/MuiEx";
const Selector = (props)=>{
    if(props.multiple === false) {
        return <Radio {...props} />
    }else {
        return <Checkbox {...props} />
    }
}
const GroupList = (props) => {
    const session = getUserSession(apis)
    const [showGroup,setShowGroup] = useState(props.showgroup)
    const [selected, setSelected] = useState(props.multiple?[]:0)
    const [error, setError] = useState()
    const [groups, setGroups] = useState([])
    let initPage = false    
    useEffect(() => {
        if (!props.showgroup) return
        if (initPage) return
        initPage = true
        apis.getGroups().then(ret => {
            apiResult(ret, (data) => { setGroups(data) }, setError)
        })
    }, [])
    const handleSelect = (id) => {
        if (!props.multiple) {
            setSelected(id)
        } else {
            let selectedIndex = selected ? selected.indexOf(id) :-1

            let newSelected = [];
            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected?selected:[], id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
                );
            }
            setSelected(newSelected)
        }
    }
    const handleSubmit = (event) => {
        setError()
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const postData = formToJson(data)
        apis.createGroup(postData).then(ret => {
            apiResult(ret, (data) => {
                setGroups(data)  
                setShowGroup(true)        
            }, setError)
        })
    };
    const handleOk = () => {
        let items = []
        if(props.multiple) {
            selected && selected.map(id=>{
                groups.map(g=>{
                    if(g.id === id) {
                        items.push(g)
                    }
                })
            })
        }else {
            selected>=0 && groups.map(g=>{
                    if(g.id === selected) {
                        items.push(g)
                    }
                })
        }
        props.onClose && props.onClose(selected,items)
    }
    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 12,width:'350px !important', display: 'flex', flexDirection: 'column', alignItems: 'left', }}>
                {props.title && <Typography sx={{mb:3}} component="h1" variant="h5">{props.title}</Typography>}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper component="form" onSubmit={handleSubmit} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }} >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Input a name to create group"
                                name="name"
                                id="name"

                                inputProps={{ 'aria-label': 'input group name' }}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <Button type="submit" sx={{ p: '10px' }} aria-label="search">Create</Button>
                        </Paper>
                        {error && <Alert sx={{ mt: 1, mb: 1 }} severity={"error"}>{error}</Alert>}
                    </Grid>
                    {showGroup && <Grid item xs={12}>
                        <Paper sx={{ maxHeight: 600, overflow: 'auto',paddingBottom:2 }}>
                            <List>
                                {groups && groups.length > 0 && groups.map((group, index) => {
                                    return <ListItem key={index} secondaryAction={<Selector multiple={props.multiple} onChange={()=>{handleSelect(group.id)}} checked={props.multiple ? (selected && (selected.indexOf(group.id) !== -1)) : (selected === group.id)} />}>
                                        <ListItemAvatar sx={{ minWidth: 30 }}>
                                            <Folder fontSize="small" />
                                        </ListItemAvatar>
                                        <ListItemText primary={group.name} />
                                    </ListItem>
                                })}
                            </List>                            
                            {(!groups || groups.length === 0) && <NoData text="There is not any group!" />}
                        </Paper>
                    </Grid>}
                    <Grid item xs={12}>
                        {props.showgroup && <Button type="button" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }} onClick={handleOk}> Ok </Button>}
                        <Button type="button" fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={() => { props.onClose && props.onClose(false) }}> Cancel </Button>

                    </Grid>
                </Grid>
            </Box>

        </Container>
    )
}
export default GroupList