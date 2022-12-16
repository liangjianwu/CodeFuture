import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop,  ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult,  getUserSession,  } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import { useNavigate, useParams } from "react-router";
import DownMenuItem from "../member/fragement/DownMenuItem";

import EditUser from "./fragement/EditUser";
import { loadAreas } from "../../Component/DataLoader";
const UserSetting = () => {
    const [loading, setLoading] = useState(false)
    const [rightDrawer, setRightDrawer] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [datas, setDatas] = useState([])
    const [role,setRole] = useState()
    const [areas,setAreas] = useState()
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
            apiResult(ret,(r)=>{
                setRole(r)
            },setError)
        })
        loadAreas(apis,setAreas,setError)
        loadUsers()
    }
    const loadUsers = ()=>{
        apis.userGet(0).then(ret => {
            setLoading(false)
            apiResult(ret, (users) => {
                params.roleid > 0 ?apis.roleuserGet(params.roleid).then(ret=>{
                    apiResult(ret,(rus=>{
                        for(let ru of rus) {
                            for(let user of users) {
                                if(user.id == ru.user_id) {
                                    user.userrole = ru
                                    break
                                }
                            }
                        }
                        setDatas(users)
                    }))
                },setError):setDatas(users)
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
        idx == -1 ? apis.userPost(data).then(ret => {
            apiResult(ret, (id) => {
                // let cc = [...datas]
                // cc.unshift({
                //     id: id,
                //     email: data.email,
                //     status:1,
                //     muser_profile: { firstname: data.firstname, lastname: data.lastname, phone: data.phone }
                // })
                // setDatas(cc)
                setAutoCloseRightDraw(true)
                setRightDrawer(false)
                loadUsers()
            }, err, errs)
        }) : apis.userPut(data).then(ret => {
            apiResult(ret, (retdata) => {
                // let cc = [...datas]
                // cc[idx].email = data.email
                // cc[idx].muser_profile.firstname = data.firstname
                // cc[idx].muser_profile.lastname = data.lastname
                // cc[idx].muser_profile.phone = data.phone
                // setDatas(cc)
                setAutoCloseRightDraw(true)
                setRightDrawer(false)
                loadUsers()
            }, err, errs)
        })
    }
    const handleRightDrawer = () => {
        if (autoCloseRightDraw)
            setRightDrawer(false)
    }

    const handleEdit = (idx, item) => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditUser data={item} areas={areas} onSubmit={(data, err, errs) => { handleAfterEdit(idx, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleAdd = () => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditUser data={{ id: 0 }} areas={areas} onSubmit={(data, err, errs) => { handleAfterEdit(-1, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleDelete = (idx, item) => {
        apis.userDelete(item.id).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 0
                setDatas(cc)
            }, setError)
        })
    }
    const handleEnable = (idx, item) => {
        apis.userPut({ id: item.id, status: 1 }).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 1
                setDatas(cc)
            }, setError)
        })
    }
    const handleCoach = (idx,item) => {
        apis.userPut({ id: item.id, is_coach: item.is_coach == 1?0:1 }).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].is_coach = item.is_coach == 1?0:1 
                setDatas(cc)
            }, setError)
        })
    }
    const handleAssistant = (idx,item) => {
        apis.userPut({ id: item.id, is_assistant: item.is_assistant == 1?0:1 }).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].is_assistant = item.is_assistant == 1?0:1
                setDatas(cc)
            }, setError)
        })
    }
    const handleView = (idx, item) => {
        navigate('/setting/role/'+item.id)
    }
    const TableHeader = [
        { name: 'id', showName: 'ID' },
        {
            name: 'name', showName: 'Name', func: (v, idx, item) => {
                return item.muser_profile.firstname + ' ' + item.muser_profile.lastname
            }
        },
        { name: 'email', showName: 'Email' },
        {
            name: 'phone', showName: 'Phone', func: (v, idx, item) => {
                return item.muser_profile.phone
            }
        },
        {
            name: 'is_coach', showName: 'Coach/Assistant', func: (v, idx, item) => {
                return <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
                    <Button variant={item.is_coach == 1?"contained":"outlined"} onClick={() => handleCoach(idx, item)}>Coach</Button>
                    <Button variant={item.is_assistant == 1?"contained":"outlined"} onClick={() => handleAssistant(idx, item)}>Assistant</Button>                    
                </ButtonGroup>
            }
        },
        {
            name: 'area', showName: 'Area', func: (v, idx, item) => {
                return item?.area?.name
            }
        },
        {
            name: 'option', showName: 'Options', func: (v, idx, item) => {
                return <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
                    <Button variant="outlined" onClick={() => handleEdit(idx, item)}>Edit</Button>
                    <Button variant={item.status == 0 ? "outlined" : "contained"} onClick={() => item.status != 0 ? handleDelete(idx, item) : handleEnable(idx, item)}>{item.status == 0 ? 'Disable' : 'Enable'}</Button>
                    <Button variant="outlined" onClick={() => handleView(idx, item)}>Roles</Button>
                </ButtonGroup>
            }
        },
    ]
    const handleUserRole = (idx,item) => {
        item.userrole ? apis.userrolePut({id:item.userrole.id,status:item.userrole.status == 1?0:1}).then(ret=>{
            apiResult(ret,data=>{
                let users = [...datas]
                users[idx].userrole.status = users[idx].userrole.status == 1?0:1
                setDatas(users)
            },setError)
        }):apis.userrolePost({user_id:item.id,role_id:params.roleid}).then(ret=>{
            apiResult(ret,data=>{
                let users = [...datas]
                users[idx].userrole = {id:data,user_id:item.id,role_id:params.roleid,status:1}
                setDatas(users)
            },setError)
        })
    }
    params.roleid > 0 && role && TableHeader.push(
        {
            name: 'role', showName: "Role:"+role?.name, func: (v, idx, item) => {
                return <Button disabled={item.status == 0} size={'small'} variant={item.userrole?.status == 1 ? "contained":"outlined"} onClick={() => handleUserRole(idx,item)}>{item.userrole?.status == 1 ? 'Enable':'Disable'}</Button>
            }
        }
    );
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
export default UserSetting