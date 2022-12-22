import { Container, Divider, Box, Toolbar, Typography, IconButton, Stack, Tooltip, Avatar, Menu, MenuItem, Button } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { getUserSession, setUserSession } from "../../Utils/Common";
import MenuDrawer from "./MenuDrawer";
const HomeLayout = () => {
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate()
    const session = getUserSession()
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(true);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleToggleDrawer = (open) => {
        setAnchorElNav(open);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = () => {
        handleCloseUserMenu()
        setUserSession()
        navigate('/')
    }

    const homemenus = [
        // { label: "Home", to: "/home/index" },
        // { label: "Events", to: "/home/events" },
        // { label: "Gallery", to: "/home/gallery" },        
        { label: "Group Lesson", to: "/home/schedule" },
        { label: "Q&A", to: "/home/qa" },
        { label: "About Us", to: "/home/about" },
    ];

    const membermenus = session ? [
        { label: "My Schedule", to: "/member/schedule" },
        { label: "Transactions", to: "/member/transactions" },
        { label: "Kids", to: "/member/kids" },
        { label: 'Logout', onClick: handleLogout }
    ] : [
        { label: "Member Login", to: "/user/signin" },
        { label: "Join us", to: "/user/signup" },
    ];
    const accountmenus = [
        { label: 'Logout', onClick: handleLogout }
    ];
    return <Container component="main" maxWidth="lg" sx={{ padding: { xs: '0' } }}>
        {/* <AppBar sx={{background:'#fff'}} position="static"> */}
        <Toolbar sx={{ zIndex:100,borderBottom:'1px solid #0001',paddingLeft: "0 !important", paddingRight: "0 !important",paddingTop:'10px',paddingBottom:'10px', position: 'fixed', top: 0, background: '#ffff',maxWidth:'1200px',width:'100%' }}>
            <IconButton size="large" sx={{display: { xs: 'block', md: 'none' } }} onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
            </IconButton>
            <MenuDrawer open={anchorElNav} menus={[homemenus, membermenus]} toggleDrawer={handleToggleDrawer} />
            <Box sx={{ height: { xs: '40px', md: '60px', },cursor:'pointer',ml:{xs:0,md:1}, mr: { xs: 1, md: 1 } }} onClick={()=>{navigate('/')}}>
                <img src="/logo1.jpg" style={{ height: '100%' }} />
            </Box>
            <Typography variant="subtitle2" component={"subtitle2"}  onClick={()=>{navigate('/')}}
                sx={{cursor:'pointer',
                    mr: 2,
                    display: { flex: '1 1', xs:'block',md: 'none' },
                    flexGrow: 1,
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >AXIS FENCING CLUB</Typography>
            <Typography variant="subtitle1" component={"subtitle1"}  onClick={()=>{navigate('/')}}
                sx={{cursor:'pointer',
                    mr: 2,
                    display: { flex:'1 1',xs: 'none',md:'block' },
                    flexGrow: 1,
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >AXIS FENCING CLUB</Typography>
            <Box sx={{ flexGrow: 1,  display: { xs: 'none', md: 'flex' } }}>
                {homemenus.map((item) => (
                    <Button
                        key={item}
                        onClick={(e) => { item.to ? navigate(item.to) : item.onClick(e) }}
                        sx={{ my: 2, display: 'block',fontWeight:'bold',width:'auto',color:'#059c',bgcolor:(window.location.pathname == item.to?'#0591':'#fff')}}>
                        {item.label}
                    </Button>
                ))}
            </Box>
           <Box sx={{ flexGrow: 0,  display: { md:'flex',xs: 'none' }}}>
            {membermenus.map((item) => (
                    item.label !== 'Logout' && <Button
                        key={item.label}
                        onClick={(e) => { item.to ? navigate(item.to) : item.onClick(e) }}
                        sx={{ my: 2, display: 'block',fontWeight:'bold',width:'auto',color:'#059c',bgcolor:(window.location.pathname == item.to?'#0591':'#fff')}}>
                        {item.label}
                    </Button>                    
                ))}
                {session && <>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                        <Avatar sx={{ bgcolor: '#ff5722' }} alt={'M'} src="#" />
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {accountmenus.map((setting) => (
                        <MenuItem key={setting} onClick={setting.onClick}>
                            <Typography textAlign="center">{setting.label}</Typography>
                        </MenuItem>
                    ))}
                </Menu></>}
            </Box>
            
            
        </Toolbar>
        {/* </AppBar> */}
        <Box sx={{ mt: { xs: 10, md: 11 } }}><Outlet /></Box>
        <Box sx={{ padding: 2, paddingBottom: 4, paddingTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#fff" }}>
            <Typography variant="body2" color="text.secondary" align="center">
                {"Axis Fencing Club"}
                <br></br>
                {'Copyright © '}
                {' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    </Container>
}

export default HomeLayout