import MyTable from "../../Component/MyTable"
import CustomerBar from "./fragement/CustomerBar";
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Alert, Chip,IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, formToJson, getUserSession } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import EditCustomerForm from './fragement/EditCustomerForm'
import CustomerOptButton from "./fragement/CustomerOptButton";
import CustomerDetail from "./fragement/CustomerDetail";
import GroupList from "./fragement/GroupList"
import { Clear, Delete } from "@mui/icons-material";

const MyCustomer = () => {    
    const [selected, setSelected] = useState([])
    const [customers, setCustomers] = useState([])
    const [filters,setFilters] = useState()
    const [totalCount, setTotalCount] = useState(0)
    const [error, setError] = useState()
    //const [rightComponent, setRightComponent] = useState()   //right drawer children
    const [rightDrawer, setRightDrawer] = useState()   //open or close right drawer
    const [autoCloseRightDrawer, setAutoCloseRightDrawer] = useState(true)

    const session = getUserSession(apis)
    const createData = (id,membership,name,city,province,create_time) =>{
        return {id,membership,name,city,province,create_time}
    }
    const loadCustomer = (page, pagesize, allData, countData) => {
        apis.loadCustomer(page, pagesize, allData, countData).then(ret => {
            apiResult(ret, (data) => {
                setTotalCount(data.total)
                const items = []
                data.data.map(item=>{
                    items.push(createData(item.id,item.membership,item.customer.name,item.customer.city,item.customer.province,item.create_time))
                })
                setCustomers(items)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadCustomer(0, 20, 0, 1)
    }, [])
    const handleEditCustomerFormClose = (changed) => {
        setRightDrawer()
        if (changed) {
            loadCustomer(0, 20, 0, 1)
        }
    }
    const handleAddCustomer = () => {        
        setRightDrawer(<EditCustomerForm onClose={handleEditCustomerFormClose} />)
        setAutoCloseRightDrawer(false)
    }
    const handleRightDrawer = () => {
        autoCloseRightDrawer && setRightDrawer(false)
    }
    const handleSelected = (selects) => {        
        setSelected(selects)
        
    }
    const handleCustomerDetailClose = (changed) => {
        setRightDrawer()
    }
    const handleCustomerDetail = (id,idx) =>{        
        setAutoCloseRightDrawer(false)
        setRightDrawer(<CustomerDetail onClose={handleCustomerDetailClose}/>)
    }
    const handleEditCustomer = (id,idx) => {        
        setAutoCloseRightDrawer(false)
        setRightDrawer(<EditCustomerForm customerid={id} onClose={handleEditCustomerFormClose}/>)
    }
    const handleChangePage = (page, rowsperpage) => {

    }
    const handleChangeRowsPerPage = (rowsperpage) => {

    }
    const filterByGroup = (ids,groups)=>{        
        if(ids) {
            setError()
            apis.getGroupCustomers(ids.toString()).then(ret=>{
                apiResult(ret,(data)=>{  
                    if(groups && groups.length>0) {
                        let ss = 'Group: '
                        groups.map(group=>{
                            ss += group.name+','
                        })
                        ss = ss.length>20?(ss.substring(0,20)+'...'):ss
                        setFilters(<Chip sx={{marginBottom:1}} label={ss} variant="outlined" onDelete={()=>{setFilters();loadCustomer(0, 20, 0, 1)}} />)
                    }
                    setCustomers(data)
                },setError)
            })
        }
        setRightDrawer()
    }
    const handleFilterByGroup = () => {
        setRightDrawer(<GroupList showgroup={true} onClose={filterByGroup} multiple={true} />)
    }
    const handleFilterByTag = () => {

    }
    const handleAddTag = () => {

    }
    const addToGroup = (ids) => {
        if(ids) {
            setError()
            apis.addToGroup(selected,ids).then(ret=>{
                apiResult(ret,(data)=>{
                    alert(data)
                },setError)
            })
        }
        setRightDrawer()
    }    
    const handleAddToGroup = () => {
        setRightDrawer(<GroupList showgroup={true} onClose={addToGroup} multiple={true} />)
    }
    const handleCreateGroup = ()=>{
        setRightDrawer(<GroupList onClose={()=>{setRightDrawer()}} />)
    }
    const handleCustomerSearch = (event)=> {
        setError()
        event.preventDefault();

        const postdata = new FormData(event.currentTarget);
        
        apis.customerSearch(postdata.get('value')).then(ret => {
            apiResult(ret, (data) => {
                setCustomers(data)
                setFilters(<Chip sx={{marginBottom:1}} label={postdata.get('value')} variant="outlined" onDelete={()=>{setFilters();loadCustomer(0, 20, 0, 1)}} />)
            }, setError,(errors)=>{
                setError(errors.value)
            })
        })
    }
    const CustomerTableHeader = [
        { name: 'name', showName: 'Customer' },
        { name: 'city', showName: 'City' },
        { name: 'province', showName: 'Province' },
        { name: 'membership', showName: 'Membership' },
        { name: 'create_time', showName: 'Date' },]
    const OptionButton = [
        {
            text: "",icon:<AddIcon fontSize="small"/>, subItems: [      
                { text: "Greate group",  icon: <AddIcon fontSize="small" />, onClick: handleCreateGroup },          
                { text: 'Add Customer', icon: <AddIcon fontSize="small" />, onClick: handleAddCustomer },
                { text: 'Import from file', icon: <UploadFileIcon fontSize="small" />, onClick: () => { } },
            ]
        },
    ]
    return (
        <>
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px",mb:2 }} onClose={()=>setError()}>{error}</Alert>}
            <CustomerBar items={OptionButton} showOptions={selected && selected.length>0} 
                onAddTag={handleAddTag} 
                onAddGroup={handleAddToGroup}                  
                onFilterByGroup={handleFilterByGroup} 
                onFilterByTag={handleFilterByTag}
                onCustomerSearch = {handleCustomerSearch}
                />
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any customer, try to add one or import from file</Alert>}
            {filters}
            {totalCount > 0 && <MyTable
                rows={customers}
                totalRow={totalCount}
                headers={CustomerTableHeader}
                checkbox={true}
                OpentionComponent={(id,idx)=>{return <CustomerOptButton onDetail={handleCustomerDetail} onEdit={handleEditCustomer} id={id} index={idx}/>}}
                onSelected={handleSelected}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />}
            <RightDrawer toggleDrawer={handleRightDrawer} open={rightDrawer?true:false}>
                {rightDrawer}
            </RightDrawer>
        </>

    )
}
export default Group