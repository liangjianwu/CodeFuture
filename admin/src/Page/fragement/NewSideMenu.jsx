import { useState, Fragment, } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Divider, List, Collapse, ListSubheader } from '@mui/material';
import { useNavigate } from 'react-router';
import { Add,  ArrowForwardOutlined, Menu, RemoveOutlined } from '@mui/icons-material';
export const NewSideMainMenu = ({ menuData }) => {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState({})
    const menuClick = (item) => {

        if (item.url && !item.hasSubmenu) {
            navigate(item.url)
        } else if (item.hasSubmenu && item.items && item.items.length > 0) {
            const mm = { [item.name]:!menuOpen[item.name] }
            setMenuOpen(mm)
        }
    }
    return (
        <Fragment>
            {menuData.map((item, index1) => {
                if (index1 == 0) {
                    localStorage.setItem("firsturl", item.url)
                }
                return <div key={index1}>
                    <ListItemButton selected={item.url && window.location.pathname === item.url} onClick={() => { menuClick(item) }}>
                        <ListItemIcon sx={{minWidth:"30px"}}>
                            {/* {menuOpen[item.name] || (item.url && window.location.pathname.indexOf(item.url) >= 0) ? <RemoveOutlined />:<Add /> } */}
                            {menuOpen[item.name] ? <RemoveOutlined />:<Add /> }
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItemButton>
                    {item.items && item.items.length > 0 && <Collapse in={menuOpen[item.name] } timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.items.map((subitem, subidx) => {
                                if (item.type === 'divider') {
                                    return <Divider key={subidx} sx={{ my: 1, pl: 4 }} />
                                } else {
                                    return <ListItemButton
                                        selected={item.url && window.location.pathname.indexOf(subitem.url) >= 0}
                                        sx={{ pl: 4 }} key={subidx}
                                        onClick={() => { menuClick(subitem) }}>
                                        <ListItemIcon sx={{minWidth:'30px'}}>
                                            {item.url && window.location.pathname.indexOf(subitem.url) >= 0? <ArrowForwardOutlined />:<></> }
                                        </ListItemIcon>
                                        <ListItemText primary={subitem.name} />
                                    </ListItemButton>
                                }
                            })}

                        </List>
                    </Collapse>}
                </div>
            })}
        </Fragment>
    )
}
