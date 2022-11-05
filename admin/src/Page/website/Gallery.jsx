import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem,Skeleton, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, formToJson, getUserSession, sessionSet } from "../../Utils/Common";
import apis from "../../api";
import { useNavigate } from "react-router";
import { ArrowDownward, ArrowUpward, Remove } from "@mui/icons-material";
import DownMenuItem from "../member/fragement/DownMenuItem";
import OptButton from "./fragement/OptButton";
import { RightDrawer } from "../../Component/MuiEx";
import ResourceEdit from "./fragement/ResourceEdit";
const Gallery = () => {    
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [resources, setResources] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [error, setError] = useState()
    const session = getUserSession(apis)
    const [rightDrawer,setRightDrawer] = useState()
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadResources = (page, pagesize, countData) => {
        setLoading(true)
        apis.loadResources('gallery',page, pagesize, countData).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                setResources(data.data)
                setCurrentPage(page)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadResources(0, rowsPerPage, 1)
    }, [])
    const handleAddResource = () => {
        setRightDrawer(<ResourceEdit item={{id:0,islocal:1,type:'gallery',resource_type:'img'}} onClose={(ret)=>{
            if(!ret){
                setRightDrawer()
            }else {
                setRightDrawer()
                loadResources(0,rowsPerPage,1)
            }
        }}/>)
    }
    const handleEditResource = (id, idx) => {
        setRightDrawer(<ResourceEdit item={resources[idx]} onClose={(ret)=>{
            if(!ret){
                setRightDrawer()
            }else {
                setRightDrawer()
                loadResources(0,rowsPerPage,1)
            }
        }}/>)
    }
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadResources(page, rowsperpage, 0)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        loadResources(0, rowsperpage, 0)
    }
    const handleRightDrawer = ()=>{

    }
    const handleRemoveResource = (id, idx) => {
        setError()
        window.confirm("Are you sure to delete the resource?") && apis.resourceStatus(id,0).then(ret => {
            apiResult(ret, (data) => {
                let cc = [...resources]
                cc.splice(idx, 1)
                setResources(cc)
            }, setError)
        })
    }
    const TableHeader = [
        { name: 'id', showName: 'ID' },
        { name:'path',showName:'Resource',func:(v,idx,row)=>{
            if(row.islocal == 1) {
                return v?<img style={{maxWidth:300,maxHeight:200}} src={"/api/resource/photo?file="+v} />:<Skeleton variant="rectangular" width={100} height={100} />
            }else {
                if(row.resource_type == 'img') {
                    return v?<img style={{maxWidth:300,maxHeight:200}} src={v} />:<Skeleton variant="rectangular" width={100} height={100} />
                }else {
                    return v?<iframe style={{maxWidth:300,maxHeight:200}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;full-screen;fullscreen" src={v} allowFullScreen />:<Skeleton variant="rectangular" width={100} height={100} />
                    //return v?<a href={v} target="_blank">Video</a>:"No video"
                }
            }
        }},
        { name: 'name', showName: 'Name' },
        { name: 'description', showName: 'Description' },         
    ]
        
    const OptionButton = [
        { text: "Add", icon: <AddIcon fontSize="small" />, onClick: handleAddResource },
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
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any resources, try to add one</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={resources}
                totalRow={totalCount}
                headers={TableHeader}
                checkbox={false}
                rowsPerPage={rowsPerPage}               
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                OpentionComponent={(id, idx) => {
                    return <OptButton id={id} index={idx}
                        onEdit={(id, idx) => { handleEditResource(id, idx) }}
                        onRemove={(id, idx) => { handleRemoveResource(id, idx) }}                        
                        
                    />
                }}
            />}
            <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer ? true : false}>
                {rightDrawer}
            </RightDrawer>
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>

    )
}
export default Gallery