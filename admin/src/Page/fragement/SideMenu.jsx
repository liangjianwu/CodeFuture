import { useState, Fragment, } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Divider, List, Collapse,ListSubheader } from '@mui/material';
import { useNavigate } from 'react-router';
import StarBorder from '@mui/icons-material/StarBorder';
export const SideMainMenu = ({ menuData }) => {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState({})
    const menuClick = (item) => {

        if (item.url && !item.hasSubmenu) {
            navigate(item.url)
        } else if (item.hasSubmenu && item.items && item.items.length > 0) {
            const mm = { ...menuOpen }
            mm[item.name] = !mm[item.name]
            setMenuOpen(mm)
        }
    }
    return (
        <Fragment>
            {menuData.map((service, index1) => {
                return <div key={index1}>
                    {service.name && <ListSubheader component="div">{service.name}</ListSubheader>}
                    {service.items.map((item, index2) => {
                        if (item.isMenu) {
                            if(index1 == 0 && index2 ==0) {
                                localStorage.setItem("firsturl",item.url)
                            }
                            const ret = <div key={index2} >                                
                                <ListItemButton selected={item.url && window.location.pathname === item.url} onClick={() => { menuClick(item) }}>
                                    <ListItemIcon>
                                        <AssignmentIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                                {item.items && item.items.length > 0 && <Collapse in={menuOpen[item.name] || (item.url && window.location.pathname.indexOf(item.url) >= 0)} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.items.map((subitem, subidx) => {
                                            if (item.type === 'divider') {
                                                return <Divider key={subidx} sx={{ my: 1, pl: 4 }} />
                                            } else {
                                                return <ListItemButton
                                                    selected={item.url && window.location.pathname.indexOf(subitem.url) >= 0}
                                                    sx={{ pl: 4 }} key={subidx}
                                                    onClick={() => { menuClick(subitem) }}>
                                                    <ListItemIcon>
                                                        <StarBorder />
                                                    </ListItemIcon>
                                                    <ListItemText primary={subitem.name} />
                                                </ListItemButton>
                                            }
                                        })}

                                    </List>
                                </Collapse>}
                            </div>
                            
                            return ret
                        }else {
                            return <></>
                        }
                    })}
                    {service.items.length > 0 && <Divider sx={{ my: 1 }} />}
                </div>
            })}
        </Fragment>
    )
}
