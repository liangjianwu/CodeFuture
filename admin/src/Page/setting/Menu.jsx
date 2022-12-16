import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop,  ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult,  getUserSession,  } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import { useNavigate, useParams } from "react-router";
import DownMenuItem from "../member/fragement/DownMenuItem";
import EditMenu from "./fragement/EditMenu";

const MenuSetting = () => {
    const [loading, setLoading] = useState(false)
    const [rightDrawer, setRightDrawer] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [datas, setDatas] = useState([])    
    const [role,setRole] = useState()
    const [error, setError] = useState()
    const navigate = useNavigate()
    const [autoCloseRightDraw, setAutoCloseRightDraw] = useState(true)
    const session = getUserSession(apis)
    const params = useParams()
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadDatas = () => {
        setLoading(true)
        params.roleid>0 && apis.roleGet(params.roleid).then(ret=>{
            apiResult(ret,(data)=>{
                setRole(data)
            },setError)
        })
        apis.menuGet(0).then(ret => {
            setLoading(false)
            apiResult(ret, (menus) => {                
                params.roleid>0 ? apis.roleauthGet(params.roleid).then(ret=>{
                    apiResult(ret,(ras)=>{
                        ras.map(ra=>{
                            for(let menu of menus) {
                                if(menu.id == ra.menu_id) {
                                    menu.roleauth = ra
                                    break
                                }
                            }
                        })
                        setDatas(menus)         
                    },setError)
                }):setDatas(menus)
            }, setError)
        })
        
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadDatas()
    }, [])

    const handleAfterEdit = (idx, data, err, errs) => {        
        idx == -1 ? apis.menuPost(data).then(ret => {
            apiResult(ret, (id) => {
                let cc = [...datas]
                cc.unshift({
                    id: id,
                    name:data.name,
                    description:data.description,
                    url:data.url,
                    type:data.type,
                    parent_id:data.parent_id,
                    method:data.method,
                    status:1,                    
                })
                setDatas(cc)
                setAutoCloseRightDraw(true)
                setRightDrawer(false)
            }, err, errs)
        }) : apis.menuPut(data).then(ret => {
            apiResult(ret, (retdata) => {
                let cc = [...datas]
                cc[idx].name = data.name                
                cc[idx].description = data.description
                cc[idx].url = data.url
                cc[idx].type = data.type
                cc[idx].parent_id = data.parent_id
                cc[idx].method = data.method
                setDatas(cc)
                setAutoCloseRightDraw(true)
                setRightDrawer(false)
            }, err, errs)
        })
    }
    const handleRightDrawer = () => {
        if (autoCloseRightDraw)
            setRightDrawer(false)
    }

    const handleEdit = (idx, item) => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditMenu data={item} onSubmit={(data, err, errs) => { handleAfterEdit(idx, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleAdd = () => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditMenu data={{ id: 0 }} onSubmit={(data, err, errs) => { handleAfterEdit(-1, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleDelete = (idx, item) => {
        apis.menuDelete(item.id).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 0
                setDatas(cc)
            }, setError)
        })
    }
    const handleEnable = (idx, item) => {
        apis.menuPut({ id: item.id, status: 1 }).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 1
                setDatas(cc)
            }, setError)
        })
    }
    const handleRoleAuth = (idx,item) =>{
        item.roleauth ? apis.roleauthPut({id:item.roleauth.id,status:item.roleauth.status == 1?0:1}).then(ret=>{
            apiResult(ret,data=>{
                let troles = [...datas]
                troles[idx].roleauth.status = troles[idx].roleauth.status == 1?0:1
                setDatas(troles)
            },setError)
        }):apis.roleauthPost({role_id:params.roleid,menu_id:item.id}).then(ret=>{
            apiResult(ret,data=>{
                let urs = [...datas]
                urs[idx].roleauth = {id:data,role_id:params.roleid,menu_id:item.id,status:1}
                setDatas(urs)
            },setError)
        })
    }
    const colors = ["#5F9EA0","#D2691E","#00008B","#006400","#8B008B","#2F4F4F","#228B22"]
    const TableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'name', showName: 'Name', func:(v,idx,item)=>{
            if(item.parent_id == 0 && item.type == 0) {
                return <span style={{color:colors[item.id%colors.length],fontWeight:'bold'}}> * {item.name}</span>
            }else if(item.type == 0) {
                return <span style={{color:colors[item.parent_id%colors.length],fontWeight:'bold'}}>{item.name}</span>
            }else if(item.parent_id != 0) {
                return <span style={{color:colors[item.parent_id%colors.length]}}>{item.name}</span>
            }else {
                return <span>{item.name}</span>
            }
        }},  
        { name: 'description', showName: 'Description', },         
        { name:'url',showName:'Url' },
        { name:'type',showName:'Type',func:(v,idx,item)=>{
            return v == 0?"Menu":"Api"
        } },
        {name:'parent_id',showName:'ParentID'},
        {name:'method',showName:'Method'},
        {
            name: 'option', showName: 'Options', func: (v, idx, item) => {
                return item.mid > 0 && <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
                    <Button variant="outlined" onClick={() => handleEdit(idx, item)}>Edit</Button>
                    <Button variant={item.status == 0 ? "outlined" : "contained"} onClick={() => item.status != 0 ? handleDelete(idx, item) : handleEnable(idx, item)}>{item.status == 0 ? 'Disable' : 'Enable'}</Button>                    
                </ButtonGroup>
            }
        },
    ]
    params.roleid>0 && role && TableHeader.push(
        {
            name: 'roleauth', showName: "Role:"+role?.name, func: (v, idx, item) => {                
                return <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
                    <Button disabled={item.status == 0} variant={item.roleauth?.status == 1?"contained":"outlined"} onClick={() => handleRoleAuth(idx, item)}>{item.roleauth?.status == 1?"ENABLE":"DISABLE"}</Button>                    
                </ButtonGroup>
            }
        }
    )
    const OptionButton = [
        { text: "Add", icon: <AddIcon fontSize="small" />, onClick: handleAdd },
    ]
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar style={{ paddingLeft: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }}>
                        {OptionButton.map((item, index) => {
                            return item.subItems ? <DownMenuItem key={index} icon={item.icon} onClick={item.onClick} items={item.subItems} text={item.text} /> :
                                <MenuItem key={index} onClick={item.onClick}>
                                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}<ListItemText>{item.text}</ListItemText>
                                </MenuItem>
                        })}
                    </Stack>
                    <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div" ></Typography>
                </Toolbar>
            </Paper>
            {datas.length == 0 && <Alert severity={"info"}>Ops! There is not any data</Alert>}
            {datas.length > 0 && <MyTable
                height={650}
                rows={datas}
                totalRow={datas.length}
                headers={TableHeader}
                checkbox={false}
                rowsPerPage={datas.length}
            />}
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
            <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer ? true : false}>
                {rightDrawer}
            </RightDrawer>
        </>

    )
}
export default MenuSetting