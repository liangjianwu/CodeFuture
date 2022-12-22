import { useRef, useState, } from 'react';
import { Outlet, } from 'react-router'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CopyRight from '../../Component/CopyRight'
import { Avatar, Alert } from '@mui/material';

import { Drawer, Title } from '../../Component/MuiEx';
import { LOGO_ICON_COLOR, LOGO_TEXT_COLOR } from '../../app/config';
const mdTheme = createTheme();
function Layout() {
    const [open, setOpen] = useState(true);
    const [title, setTitle] = useState("Lesson")
    const [currentIdx, setCurrentIdx] = useState(0)
    const [menus, setMenus] = useState([])
    const onMenuItemClick = useRef()
    const onContentLoad = (title, menuitems, menuItemClick) => {
        setTitle(title)
        setMenus(menuitems)
        onMenuItemClick.current = menuItemClick
    }
    const onPartChanged = (idx) => {
        setCurrentIdx(idx)
    }
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer variant="permanent" open={open} >
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                            background: 'white',
                            color: LOGO_ICON_COLOR,
                        }}>
                        <img src="/logo.png" style={{ width: '100%' }} />
                        <IconButton onClick={toggleDrawer} sx={{ background: 'white' }}>
                            <ChevronLeftIcon sx={{ display: open ? 'block' : 'none' }} />
                            <Avatar src="/icon.webp" sx={{ display: open ? 'none' : 'block' }} />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <Title sx={{ pl: 2, pr: 2, pt: 2, pb: 1, overflow: 'hide', width: '100%' }}>{open && title}</Title>
                    <List component="nav" sx={{ p: 0 }}>
                        {menus.map((item, idx) =>
                            <ListItem selected={idx === currentIdx} key={idx} onClick={() => { onMenuItemClick.current && onMenuItemClick.current(item, idx) }} sx={{ pt: 1, pb: 1 }}>
                                <ListItemAvatar sx={{ display: open ? 'none' : 'block' }} title={item.title}>
                                    <Avatar sx={{ bgcolor: idx === currentIdx ? LOGO_ICON_COLOR : LOGO_TEXT_COLOR }}>{item.pageNo}</Avatar>
                                </ListItemAvatar>
                                <ListItemText sx={{ color: LOGO_TEXT_COLOR }}>{item.title}</ListItemText>
                            </ListItem>
                        )}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}>
                    <Box sx={{ width: "100%", paddingLeft: 2, paddingRight: 2 }}>
                        <Box sx={{ minHeight: 600 }}>
                            <Box mt={2}><Outlet context={[onContentLoad, onPartChanged]} /></Box>
                        </Box>
                        <CopyRight sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Box >
        </ThemeProvider >
    );
}

export default Layout;