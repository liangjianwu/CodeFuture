
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { getUserSession, setUserSession } from '../Utils/Common';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const TopBar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate()
  const session = getUserSession()  
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleClickMenu = (to) =>{
    navigate(to)
    handleCloseNavMenu()
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = ()=>{
    handleCloseUserMenu()
    setUserSession()
    navigate('/')
  }
  const menus = [
    // {label:"Home",to:"/member/index"},
    // {label:"My transactions",to:"/member/transactions"},
    // {label:"My kids",to:"/member/kids"},
    // {label:"Class records",to:"/member/classrecords"}
  ];
  const settings = [
    {label:'Logout',onClick:handleLogout}
  ];
  
  return (
    <AppBar position="static" sx={props.sx}>
      <Container maxWidth="xl" sx={{ padding: 0 }}>
        <Toolbar disableGutters>
          <Avatar sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} src="/logo1.png" />
          <Typography variant="h6" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.1rem', color: 'inherit', textDecoration: 'none',}}>
            CodeFuture
          </Typography>
          {session && <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left',}} keepMounted 
              transformOrigin={{ vertical: 'top', horizontal: 'left', }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{display: { xs: 'block', md: 'none' },}}>
              {menus.map((menu) => {
                return <MenuItem key={menu.label} onClick={()=>{handleClickMenu(menu.to)}}>
                  <Typography textAlign="center">{menu.label}</Typography>
                </MenuItem>
              })}
            </Menu>
          </Box>}
          <Avatar sx={{ display: { xs: 'flex', md: 'none' }, mr: 1,ml:1 }} src="/logo1.png" />
          <Typography variant="h8" noWrap component="a" href="/" sx={{
              mr: 2,
              display: { flex: '1 1 100%', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>CodeFuture</Typography>
          {session && <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {menus.map((menu) => (
              <Button key={menu.label} onClick={()=>{handleClickMenu(menu.to)}} sx={{ my: 2, color: 'white', display: 'block' }}>{menu.label}</Button>
            ))}
          </Box> }

          {session && <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                <Avatar sx={{bgcolor:'#ff5722'}} alt="U" src="#" />
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={setting.onClick}>
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default TopBar;
