import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router'
import {  createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { CircularProgress,Alert,Backdrop, } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CopyRight from '../../Component/CopyRight'
import { apiResult, getUserSession } from '../../Utils/Common';
import apis from '../../api';
import { SideMainMenu } from '../fragement/SideMenu';
import {AppBar,Drawer} from '../../Component/MuiEx'
import { loadCrmContent } from '../../App/DataLoad';
import LogoutIcon from '@mui/icons-material/Logout';

const ThemeTitle = 'Servify CRM'

const mdTheme = createTheme();
function DashboardContent() {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(true)
    const [sideMenuData,setSideMenuData] = useState()
    const [error,setError] = useState()
    const navigate = useNavigate()
    const session = getUserSession(apis)
    let initPage = false
    if (!session) {
        navigate('/account/signin')
    } else if (session.email_verified === 0 && window.location.pathname !== '/service/user/emailverify') {
        navigate('/service/user/emailverify')
    }
    useEffect(() => {
        if(initPage) return
        initPage = !initPage
                  
            loadCrmContent(apis, (data) => {
                setLoading(false)    
                setSideMenuData(data)            
            },(error)=>{
                setLoading(false)
                setError(error)
            })
    }, [])

    const toggleDrawer = () => {
        setOpen(!open);
    };
    return (
        loading ? <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
        </Backdrop> : <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            {!open ? ThemeTitle:""}
                        </Typography>  
                        <Typography sx={{cursor:"pointer"}} onClick={()=>navigate('/service/dashboard')}><LogoutIcon /></Typography>   
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                            background:'#1976d2',
                            color:'#fff'
                        }}
                    >   
                    <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            pl={1}
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >{ThemeTitle}
                        </Typography>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon sx={{color:'#fff'}}/>
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <SideMainMenu menuData={sideMenuData}/>                        
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
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: "auto",width:"100%",paddingLeft:10,paddingRight:10 }}>
                        <Box sx={{ minHeight: 600 }}>
                            {error && <Alert severity={"warning"} sx={{ width: '100%',marginTop:"5px" }}>{error}</Alert>}
                            {!error && sideMenuData.length>0 && <Box mt={5}><Outlet /></Box>}
                        </Box>
                        <CopyRight sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Box>

        </ThemeProvider>
    );
}

export default function Layout() {
    return <DashboardContent />;
}
