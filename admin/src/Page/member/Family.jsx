import MyTable from "../../Component/MyTable"
import FamilyBar from "./fragement/FamilyBar";
import { Alert,  Chip, Snackbar, Backdrop, Stack, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { apiResult,  getUserSession } from "../../Utils/Common";
import apis from "../../api";
import { MemberLevel, MemberStatus, RightDrawer } from "../../Component/MuiEx";
import UserEditForm from "./fragement/UserEditForm";
import { useNavigate } from "react-router";
import UserOptButton from "./fragement/UserOptButton";
import ImportUser from "./fragement/ImportUser";
import MemberEditForm from "./fragement/MemberEditForm";
import { Add } from "@mui/icons-material";

const Family = () => {    
    const [loading,setLoading] = useState(false)
    const [hintMsg,setHintMsg] = useState()
    const [familys, setFamilys] = useState([])
    const [filters, setFilters] = useState()
    const [currentPage,setCurrentPage] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(20)
    const [totalCount, setTotalCount] = useState(0)
    const [currentQuery,setCurrentQuery] = useState()
    const [error, setError] = useState()
    //const [rightComponent, setRightComponent] = useState()   //right drawer children
    const [rightDrawer, setRightDrawer] = useState()   //open or close right drawer
    const [autoCloseRightDrawer, setAutoCloseRightDrawer] = useState(true)
    const navigate = useNavigate()
    const session = getUserSession(apis)
    const showOption = useRef(-2)
    const handleOrder = (item)=>{
        const neworder = orderField.order == 'desc'?'asc':'desc'
        setOrderField({...orderField,name:item.name,order:neworder})
        currentQuery && currentQuery.action == 'loadUsers' && loadUser(0,rowsPerPage,0,item.name,neworder)
    }
    const [orderField,setOrderField] = useState({fields:['id','name'],name:'id',order:'desc'})

    const handleHintClose = () =>{
        setHintMsg()
    }
    const loadUser = (page, pagesize, countData,orderfield,order) => {
        setLoading(true)
        apis.loadUser(page, pagesize, countData,showOption.current,orderfield,order).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                familys.length>0 && setHintMsg('Loaded data successfully')                
                setFamilys(data.data)
                setCurrentQuery({action:'loadUsers'})
                setCurrentPage(page)
            }, setError)
        }).catch(e=>{
            setError(e.message)
            setLoading(false)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadUser(0, rowsPerPage, 1,'id','desc')        
    }, [])
    const handleEditFamilyFormClose = (changed) => {
        setRightDrawer()
        if (changed) {
            loadUser(currentPage, rowsPerPage, 1,orderField.name,orderField.order)
        }
    }
    const handleEditFamily = (id,idx) => {
        setRightDrawer(<UserEditForm user={familys[idx]} onClose={handleEditFamilyFormClose} />)
        setAutoCloseRightDrawer(false)
    }
    const handleAddFamily = (id,idx) => {
        setRightDrawer(<UserEditForm onClose={handleEditFamilyFormClose} />)
        setAutoCloseRightDrawer(false)
    }
    const handleAddKids = (id,idx) => {
        setRightDrawer(<MemberEditForm user_id={id} onClose={(ret)=>{
            setRightDrawer()
            if(ret) {
                loadUser(currentPage,rowsPerPage,0,orderField.name,orderField.order)
                setHintMsg("Succeed to add kid")
            }
        }} />)
        // setAutoCloseRightDrawer(false)
    }
    const handleRightDrawer = () => {
        autoCloseRightDrawer && setRightDrawer(false)
    }
 
    const handleChangePage = (page, rowsperpage) => {
        if(currentQuery && currentQuery.action === 'searchFamilys') {
            searchFamilys(currentQuery.p1,page,rowsperpage,0)
        }else {
            loadUser(page, rowsperpage, 0,orderField.name,orderField.order)        
        }
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        setError()        
        if(currentQuery && currentQuery.action === 'searchFamilys') {
            searchFamilys(currentQuery.p1,0,rowsperpage,0)
        }else {
            loadUser(0, rowsperpage, 0,orderField.name,orderField.order)        
        }
    }
    const searchFamilys = (value,page,rowperpage,countdata) =>{
        setLoading(true)
        apis.userSearch(value,page,rowperpage,countdata,showOption.current).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                (countdata == 1) && setTotalCount(data.total)
                setFamilys(data.data)
                setFilters(<Chip sx={{ marginBottom: 1 }} label={value} variant="outlined" onDelete={() => { setFilters(); loadUser(0,rowsPerPage,1,orderField.name,orderField.order) }} />)
                setCurrentQuery({action:'searchFamilys',p1:value})                
            }, setError, (errors) => {
                setError(errors.value)
                setLoading(false)
            })
        })        
    }
    const handleShowOption = (name,value) =>{
        showOption.current = Number(value)
        currentQuery.action === 'loadUsers' && loadUser(0, rowsPerPage, 1,orderField.name,orderField.order)        
        currentQuery.action === 'searchFamilys' && searchFamilys(currentQuery.p1, 0, rowsPerPage, 1)
    }
    const handleFamilySearch = (event) => {
        setError()
        event.preventDefault();
        const postdata = new FormData(event.currentTarget);
        searchFamilys(postdata.get('value'),0,rowsPerPage,1)
    }
    
    const handleImportFile = ()=> {
        setAutoCloseRightDrawer(false)
        setRightDrawer(<ImportUser onClose={()=>{
                setRightDrawer()
                setAutoCloseRightDrawer(true)
                loadUser(0,rowsPerPage,1,orderField.name,orderField.order)
            }}/>)
    }
    const changeStatus = (id,status,idx)=>{
        apis.changeUserStatus(id,status).then(ret=>{
            apiResult(ret,data=>{
                let cc = [...familys]
                cc[idx].status = status
                setFamilys(cc)
            },setError)
        })
    }
    const handlePending = (id,idx) =>{
        changeStatus(id,0,idx)
    }
    const handleActive = (id,idx)=>{
        changeStatus(id,1,idx)
    }
    const handleInActive = (id,idx)=>{
        changeStatus(id,2,idx)
    }
    const handleDelete = (id,idx)=>{
        changeStatus(id,-1,idx)
    }
    const handleAddKid = (id,idx)=>{
        handleAddKids(id,idx)
    }
    const handleEditKid = (id)=>{
        setAutoCloseRightDrawer(false)
        setRightDrawer(<MemberEditForm id={id} onClose={(ret)=>{
            setRightDrawer()
            if(ret) {
                loadUser(currentPage,rowsPerPage,0,orderField.name,orderField.order)
            }
        }} />)
    }
    const FamilyTableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'name', showName: 'Family' },
        { name: 'phone', showName: 'Contact',func:(v,idx,row)=>{
            return <Stack direction={'column'}>
                <Typography variant="body2">{v}</Typography>
                <Typography variant="body2">{row.email}</Typography>
            </Stack>
        } },    
        { name:'members',showName:'Kids',func:(v,idx,row)=>{
            if(v.length>0) {
                return <div>
                    {v.map((k,i)=>{
                        const {status,icon} = MemberStatus(k.status)
                        const {color,level,label} = MemberLevel(k.level)
                        return <Chip size="small" title={level+'-'+status} variant="outlined" icon={icon} label={label+'-'+k.name} sx={{m:"1px",borderColor:'#0001'}} onClick={()=>{handleEditKid(k.id)}} key={i} />
                    })}
                    <IconButton onClick={()=>handleAddKid(row.id,idx)}><Add fontSize={"small"}/></IconButton>
                </div>
            }else {
                return  <IconButton onClick={()=>handleAddKid(row.id,idx)}><Add fontSize={"small"}/></IconButton>
            }
        }},
        { name: 'create_time', showName: 'Date',func:(v)=>{
            return new Date(v).toLocaleDateString()
        } },  
        { name:'status',showName:'Status',func:(v)=>{
            const status = ['Removed','Pending','Active','Not active']
            const colors = ['#0005','red','green','#0008']
            return <span style={{color:colors[Number(v)+1]}}>{status[Number(v)+1]}</span>
        }} ,
        ] 
    const handleOrders = (id,idx)=>{
        navigate('/accounting/orders/'+ id+"/" + 0)
    }
    return (
        <>
            {loading && <Backdrop />}
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <FamilyBar 
                onImport={handleImportFile}
                onSearch={handleFamilySearch}  
                onAdd = {handleAddFamily}
                onShowOption = {handleShowOption}
            ></FamilyBar>
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any memebrs</Alert>}
            {filters}
            {totalCount > 0 && <MyTable
                height={650}
                rows={familys}
                totalRow={totalCount}
                headers={FamilyTableHeader}
                checkbox={false}
                rowsPerPage={rowsPerPage}
                order={orderField}
                onOrder={handleOrder}
                OpentionComponent={(id, idx) => { return <UserOptButton id={id} index={idx} 
                    onAddKids={handleAddKids}
                    onEdit={handleEditFamily}
                    onPending = {handlePending}
                    onActive = {handleActive}
                    onOrders = {handleOrders}
                    onDelete = {handleDelete}
                    onInActive = {handleInActive}
                />}}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />}
            <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer ? true : false}>
                {rightDrawer}
            </RightDrawer>            
            {hintMsg && <Snackbar anchorOrigin={{ vertical:'bottom',horizontal:'right' }} open={hintMsg?true:false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>

    )
}
export default Family