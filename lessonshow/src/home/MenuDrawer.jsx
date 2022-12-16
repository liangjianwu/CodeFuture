import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import { Divider,Toolbar, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router';


export default function MenuDrawer(props) {
    const navigate = useNavigate()
    const toggleDrawer = (open) => (event) => {
        props.toggleDrawer && props.toggleDrawer(open)
    };


    return <Drawer
        anchor={'left'}
        open={props.open}
        onClose={toggleDrawer(false)}
    >
        <Box
            sx={{ width: 260 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Toolbar sx={{ padding: 1, background: '#fff' }} onClick={()=>{navigate('/')}}>
                <Box sx={{ height:'40px', mr: 2}}>
                    <img src="/logo1.jpg" style={{ height: '100%' }} />
                </Box>
                <Typography variant="subtitle2" component={"subtitle2"}
                    sx={{
                        mr: 2,
                        display: { flex: '1 1 100%', md: 'none' },
                        flexGrow: 1,
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >AXIS FENCING CLUB</Typography>
            </Toolbar>
            {props.menus && props.menus.map((submenus, index) => {
                return <><List>
                    {submenus.map((item, index) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton onClick={(e) => { item.to ? navigate(item.to) : item.onClick(e) }}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                    {index !== props.menus.length && <Divider />}
                </>
            })}
        </Box>
    </Drawer>

}
