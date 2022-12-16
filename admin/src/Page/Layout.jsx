import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CopyRight from '../Component/CopyRight'
import { Avatar, Backdrop, Alert } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import ContentCut from '@mui/icons-material/ContentCut';
import { apiResult, getUserSession, setCoachSession, setUserSession } from '../Utils/Common';
import apis from '../api';
import { loadUserContent } from '../App/DataLoad'
import { SideMainMenu } from './fragement/SideMenu';
import { AppBar, Drawer } from '../Component/MuiEx';
import { NewSideMainMenu } from './fragement/NewSideMenu';
const drawerWidth = 240;

const mdTheme = createTheme();
function DashboardContent() {
    const [open, setOpen] = useState(true);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [accountAnchorEl, setAccountAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true)
    const [sideMenuData, setSideMenuData] = useState()
    const [merchant, setMerchant] = useState()
    const [error, setError] = useState()
    const navigate = useNavigate()
    const session = getUserSession(apis)
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = !initPage        
        if (!session || session.isCoach) {   
            setUserSession()
            setCoachSession()   
            window.location.href = '/account/signin'
        } else if (session.email_verified === 0 && window.location.pathname !== '/service/user/emailverify') {
            //setLoading(false)    
            window.location.href = '/service/user/emailverify'
        } else {
            loadUserContent(apis, (data) => {
                setLoading(false)
                sideMenuDataPrepare(data.serviceMenu)
                setMerchant(data.merchant)
            }, (error) => {
                setLoading(false)
                setError(error)
            })
        }        
    }, [])
    const sideMenuDataPrepare = (menus)=>{
        let funcs = []
        for(let menu of menus) {
            if(menu.parent_id == 0) {
                funcs.push({
                    isMenu:true,name:menu.name,items:[],auth:true,type:'entrance',url:menu.url,hasSubmenu:true,id:menu.id,parent_id:menu.parent_id
                })
            }else {                
                for(let M of funcs) {                    
                    if(M.id == menu.parent_id) {
                        M.items.push({
                            isMenu:true,name:menu.name,auth:true,type:'page',url:menu.url,
                        })
                        break
                    }
                }
            }
        }
        console.log(funcs)
        setSideMenuData(funcs)
    }
    useEffect(()=>{
        document.title = merchant ? merchant.name:"Servify"
    },[merchant])

    const toggleDrawer = () => {
        setOpen(!open);
    };
    const handleAccountMenuClose = () => {
        setAccountAnchorEl(null)
        setAccountMenuOpen(false)
    }
    const handleAvatarClick = (event) => {
        setAccountAnchorEl(event.currentTarget)
        setAccountMenuOpen(true)
    }
    const handleSignOut = () => {
        apis.signOut().then(ret => {
            apiResult(ret, (data) => {
                setUserSession()
                navigate('/account/signin')
            }, error => {
                setUserSession()
                navigate('/account/signin')
            })
        })
        setAccountAnchorEl(null)
        setAccountMenuOpen(false)
    }
    return (
        loading ? <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
        </Backdrop> : <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ pr: '24px', }} >
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
                            {!open && (merchant ? merchant.name:"Servify")}
                        </Typography>
                        <Avatar sx={{ bgcolor: deepOrange[500], cursor: 'pointer' }}
                            aria-controls={accountMenuOpen ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={accountMenuOpen ? 'true' : undefined}
                            onClick={handleAvatarClick}
                        >U</Avatar>
                        <Menu
                            id="account-menu"
                            anchorEl={accountAnchorEl}
                            open={accountMenuOpen}
                            onClose={handleAccountMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleSignOut}>
                                <ListItemIcon>
                                    <ContentCut fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Logout</ListItemText>
                            </MenuItem>
                        </Menu>
                        {/* <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton> */}
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} >
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
                        >
                            {merchant ? merchant.name:"Servify"}
                        </Typography>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon sx={{color:'#fff'}}/>
                        </IconButton>
                    </Toolbar>
                    <Divider />

                    <List component="nav">
                        <NewSideMainMenu menuData={sideMenuData}/>                        
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
                    <Box sx={{ width:"100%",paddingLeft:2,paddingRight:2 }}>
                        <Box sx={{ minHeight: 600 }}>
                            {error && <Alert severity={"warning"} sx={{ width: '100%',marginTop:"5px" }}>{error}</Alert>}
                            {!error && <Box mt={2}><Outlet /></Box>}
                        </Box>
                        <CopyRight sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Box >
        </ThemeProvider >
    );
}

export default function Layout() {
    return <DashboardContent />;
}
