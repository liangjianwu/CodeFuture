import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop,  ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult,  getUserSession,  } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import { useNavigate, useParams } from "react-router";
import DownMenuItem from "../member/fragement/DownMenuItem";
import EditArea from "./fragement/EditArea";
const AreaSetting = () => {
    const [loading, setLoading] = useState(false)
    const [rightDrawer, setRightDrawer] = useState()
    const [hintMsg, setHintMsg] = useState()
    const [datas, setDatas] = useState([])
    const [error, setError] = useState()
    const navigate = useNavigate()
    const [autoCloseRightDraw, setAutoCloseRightDraw] = useState(true)
    const session = getUserSession(apis)
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadDatas = () => {
        setLoading(true)        
        apis.areaGet(0).then(ret => {
            setLoading(false)
            apiResult(ret, (areas) => {
                setDatas(areas)
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
        idx == -1 ? apis.areaPost(data).then(ret => {
            apiResult(ret, (id) => {
                let cc = [...datas]
                cc.unshift({
                    id: id,
                    name:data.name,
                    description:data.description,                    
                    status:1
                })
                setDatas(cc)
                setAutoCloseRightDraw(true)
                setRightDrawer(false)
            }, err, errs)
        }) : apis.balancePut(data).then(ret => {
            apiResult(ret, (retdata) => {
                let cc = [...datas]
                cc[idx].name = data.name
                cc[idx].description = data.description                
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
        setRightDrawer(<EditArea data={item} onSubmit={(data, err, errs) => { handleAfterEdit(idx, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleAdd = () => {
        setAutoCloseRightDraw(false)
        setRightDrawer(<EditArea data={{ id: 0 }} onSubmit={(data, err, errs) => { handleAfterEdit(-1, data, err, errs) }} onClose={() => { setRightDrawer(false) }} />)
    }
    const handleDelete = (idx, item) => {
        apis.areaDelete(item.id).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 0
                setDatas(cc)
            }, setError)
        })
    }
    const handleEnable = (idx, item) => {
        apis.areaPut({ id: item.id, status: 1 }).then(ret => {
            apiResult(ret, data => {
                let cc = [...datas]
                cc[idx].status = 1
                setDatas(cc)
            }, setError)
        })
    }
    const TableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'name', showName: 'Area'},
        { name: 'description', showName: 'Description' },
        {
            name: 'option', showName: 'Options', func: (v, idx, item) => {
                return <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
                    <Button variant="outlined" onClick={() => handleEdit(idx, item)}>Edit</Button>
                    <Button variant={item.status == 0 ? "outlined" : "contained"} onClick={() => item.status != 0 ? handleDelete(idx, item) : handleEnable(idx, item)}>{item.status == 0 ? 'Disable' : 'Enable'}</Button>                    
                </ButtonGroup>
            }
        },
    ]
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
export default AreaSetting