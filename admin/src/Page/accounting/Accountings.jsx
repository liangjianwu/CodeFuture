import MyTable from "../../Component/MyTable"
import { Alert,  Button, Chip, Snackbar, Backdrop } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, sessionGet, getUserSession, sessionSet } from "../../Utils/Common";
import apis from "../../api";
import { MemberStatus, RightDrawer } from "../../Component/MuiEx";
import CustomerBar from "./fragement/CustomerBar";
import GroupList from "../member/fragement/GroupList"
//import ImportCustomerFile from "../member/fragement/ImportCustomerFile";
import Recharge from "./fragement/Recharge";
import Charge from "./fragement/Charge";
import MemberOptButton from "./fragement/MemberOptButton";
import { useNavigate } from "react-router";
import MemberEditForm from "../member/fragement/MemberEditForm";
import { getBalanceProduct } from "./config";

const Accountings = () => {
    const [selected, setSelected] = useState([])
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [customers, setCustomers] = useState([])
    const [filters, setFilters] = useState()
    const [currentGroup, setCurrentGroup] = useState()
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [currentQuery, setCurrentQuery] = useState()
    const [error, setError] = useState()
    //const [rightComponent, setRightComponent] = useState()   //right drawer children
    const [rightDrawer, setRightDrawer] = useState()   //open or close right drawer
    const [autoCloseRightDrawer, setAutoCloseRightDrawer] = useState(true)
    const navigate = useNavigate()
    const session = getUserSession(apis)
    const [header, setHeader] = useState([
        { name: 'id', showName: 'ID' },
        { name: 'parent', showName: 'Family' },
        { name: 'name', showName: 'Member' },
    ])

    const handleHintClose = () => {
        setHintMsg()
    }
    const loadMembers = (page, pagesize, countData) => {
        setLoading(true)
        apis.loadMembers(page, pagesize, countData).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                setCustomerData(data.data)
                setCurrentQuery({ action: 'loadMembers' })
                setCurrentPage(page)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadMembers(0, rowsPerPage, 1)
    }, [])
    const handleEditCustomerFormClose = (changed) => {
        setRightDrawer()
        if (changed) {
            loadMembers(0, rowsPerPage, 1)
        }
    }
    // const handleAddCustomer = () => {
    //     setRightDrawer(<EditCustomerForm onClose={handleEditCustomerFormClose} />)
    //     setAutoCloseRightDrawer(false)
    // }
    const handleRightDrawer = () => {
        autoCloseRightDrawer && setRightDrawer(false)
    }
    const handleSelected = (selects) => {
        setSelected(selects)

    }
    const handleCustomerDetailClose = (changed) => {
        setRightDrawer()
    }
    // const handleCustomerDetail = (id, idx) => {
    //     setAutoCloseRightDrawer(false)
    //     setRightDrawer(<CustomerDetail onClose={handleCustomerDetailClose} />)
    // }
    const handleEditCustomer = (id, idx) => {
        setAutoCloseRightDrawer(false)
        setRightDrawer(<MemberEditForm id={id} onClose={handleEditCustomerFormClose} />)
    }
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadData(page, rowsperpage)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        setError()
        loadData(0, rowsperpage)
    }
    const loadData = (page, rowsperpage) => {
        currentQuery.action == 'loadMembers' && loadMembers(page, rowsperpage, 0)
        currentQuery.action == 'filterByGroup' && filterByGroup(currentQuery.p1, currentQuery.p2, page, rowsperpage, 0)
        currentQuery.action == 'searchCustomers' && searchCustomers(currentQuery.p1, page, rowsperpage, 0)
    }
    const filterByGroup = (id, groups, page, rowperpage, countdata) => {
        if (id > 0) {
            setLoading(true)
            apis.getGroupMembers(id, page, rowperpage, countdata).then(ret => {
                setLoading(false)
                apiResult(ret, (data) => {
                    if (groups && groups.length > 0) {
                        let ss = ''
                        groups.map(group => {
                            ss += group.name + '  '
                        })
                        ss = ss.length > 20 ? (ss.substring(0, 20) + '...') : ss
                        setFilters(<Chip sx={{ marginBottom: 1 }} label={ss} variant="outlined" onDelete={() => { setFilters(); setCurrentGroup(); loadMembers(0, rowsPerPage, 1) }} />)
                        if (groups.length == 1) {
                            setCurrentGroup(groups[0])
                        } else {
                            setCurrentGroup()
                        }
                    }
                    countdata == 1 && setTotalCount(data.total)
                    setCustomerData(data.data)
                    setHintMsg('Loaded data successfully')
                    setCurrentQuery({ action: 'filterByGroup', p1: id, p2: groups })
                    setCurrentPage(page)
                }, setError)
            })

        }
    }
    const addToGroup = (ids) => {
        if (ids) {
            setError()
            apis.addToGroup(selected, ids).then(ret => {
                apiResult(ret, (data) => {
                    setHintMsg('Added Successfully')
                }, setError)
            })
        }
        setRightDrawer()
    }
    const handleAddToGroup = () => {
        setRightDrawer(<GroupList showgroup={true} onClose={addToGroup} multiple={true} />)
    }
    const removeItemFromList = (ids) => {
        let cc = [...customers]
        for (let i = cc.length - 1; i >= 0; i--) {
            if (ids.indexOf(cc[i].id) >= 0) {
                cc.splice(i, 1)
            }
        }
        setCustomers(cc)
    }
    const handleRemoveFromGroup = () => {
        if (currentGroup) {
            setError()
            apis.removeFromGroup({ ids: selected, groupid: currentGroup.id }).then(ret => {
                apiResult(ret, (data) => {
                    removeItemFromList(selected)
                    setHintMsg('Succeed to remove ' + data + ' customer from the group')
                }, setError)
            })
        }
    }
    const handleFilterByGroup = () => {
        setRightDrawer(<GroupList showgroup={true} onClose={
            (ids, groups) => { setError(); ids && filterByGroup(ids, groups, 0, rowsPerPage, 1); setRightDrawer() }
        } multiple={false} />)
    }
    const showChargeForm = (id, products) => {
        if (id > 0) {
            setRightDrawer(<Charge products={products} customerid={id} onClose={(ret) => { setRightDrawer(); ret && loadData(currentPage, rowsPerPage) }} />)
        } else if (selected.length > 0) {
            console.log(selected)
            setRightDrawer(<Charge products={products} customers={selected} onClose={(ret) => { setRightDrawer(); ret && loadData(currentPage, rowsPerPage) }} />)
        }
    }
    const handleCharge = (id, idx) => {
        let products = sessionGet('products')
        if (!products) {
            setLoading(true)
            apis.loadProducts(0, 100, 0).then(ret => {
                setLoading(false)
                apiResult(ret, (data) => {
                    products = data.data
                    sessionSet('products', products)
                    showChargeForm(id, products)
                }, setError)
            })
        } else {
            showChargeForm(id, products)
        }
    }
    const handleRecharge = (id, idx) => {
        if (id > 0) {
            setRightDrawer(<Recharge customerid={id} onClose={(ret) => { setRightDrawer(); ret && loadData(currentPage, rowsPerPage) }} />)
        } else if (selected.length == 1) {
            setRightDrawer(<Recharge customerid={selected[0]} onClose={(ret) => { setRightDrawer(); ret && loadData(currentPage, rowsPerPage) }} />)
        }
    }
    const setCustomerData = (data) => {
        const items = []
        const hh = [
            { name: 'id', showName: 'ID' },
            { name: 'birthday', showName: 'Member ID',func:(v,idx,row)=>{
                if(row.status > 0) {
                    let n = 10000+Number(row.id)
                    return "1"+ (row.gender == 'Male'?"1":"0") + ((row.birthday && row.birthday != null)?row.birthday.substring(0,4):'0000')  + n
                }else {
                    return ''
                }
            } },
            { name: 'name', showName: 'Member',func:(v,idx,row)=>{
                const {icon,status} = MemberStatus(row.status)
                return <Chip size="small" variant="outlined" title={status} icon={icon}  label={v} sx={{m:"1px",border:"0px"}} />
            } },                       
            { name: 'parent',showName:'Family'},    
            { name: 'phone',showName:'Phone'},   
        ]
        data.map(item => {
            let d = { id: item.id,birthday:item.birthday,gender:item.gender, name: item.name,parent:item.user_profile.name,phone:item.user_profile.phone,status:item.status }
            item.user_balances.map(b => {
                if (b.member_id == 0 || b.member_id == item.id) {
                    d[b.type] = b.balance
                    let h = []
                    hh.map(item => {
                        if (item.name == b.type) h.push(item)
                    })
                    if (h.length == 0) {
                        hh.push({ name: b.type, showName: getBalanceProduct(b.type).label })
                    }
                }
            })
            items.push(d)
        })
        setHeader(hh)
        setCustomers(items)
    }
    const searchCustomers = (value, page, rowperpage, countdata) => {
        setLoading(true)
        apis.memberSearch(value, page, rowperpage, countdata).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countdata == 1 && setTotalCount(data.total)
                setCustomerData(data.data)
                setFilters(<Chip sx={{ marginBottom: 1 }} label={value} variant="outlined" onDelete={() => { setFilters(); loadMembers(0, rowsPerPage, 1) }} />)
                setCurrentQuery({ action: 'searchCustomers', p1: value })
                setCurrentPage(page)
            }, setError, (errors) => {
                setError(errors.value)
            })
        })

    }
    const handleCustomerSearch = (event) => {
        setError()
        event.preventDefault();
        const postdata = new FormData(event.currentTarget);
        searchCustomers(postdata.get('value'), 0, rowsPerPage, 1)
    }
    const handleCloseSecondBar = () => {
        setSelected()
    }
    const handleTransactionHistory = (id, idx) => {
        navigate("/accounting/transactions/" + id)
    }
    const handleSwitch = () => {
        navigate("/accounting/balance")
    }
    // const OptionButton = [
    //     {
    //         text: "", icon: <AddIcon fontSize="small" />, subItems: [
    //             { text: "Greate group", icon: <AddIcon fontSize="small" />, onClick: handleCreateGroup },
    //             { text: 'Add Member', icon: <AddIcon fontSize="small" />, onClick: handleAddCustomer },
    //             { text: 'Import from file', icon: <UploadFileIcon fontSize="small" />, onClick: handleImportCustomerFile },
    //         ]
    //     },
    // ]
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <CustomerBar
                onFilterByGroup={handleFilterByGroup}
                onCustomerSearch={handleCustomerSearch}
                onCloseSecondBar={handleCloseSecondBar}
                onSwitch = {handleSwitch}
            >{selected && selected.length > 0 && <>
                <Button variant="contained" onClick={handleAddToGroup} sx={{ ml: 2, fontSize: 12, cursor: 'hand' }} >
                    Group
                </Button>
                {currentGroup && <Button variant="outlined" onClick={handleRemoveFromGroup} sx={{ ml: 2, fontSize: 12, width: 240, cursor: 'hand' }} >
                    Remove from {currentGroup.name}
                </Button>}
                <Button variant="contained" onClick={handleCharge} sx={{ ml: 2, fontSize: 12, cursor: 'hand' }} >
                    Charge
                </Button>
                {selected.length === 1 && <Button variant="contained" color="success" onClick={handleRecharge} sx={{ ml: 2, fontSize: 12, cursor: 'hand' }} >
                    Recharge
                </Button>}
            </>}
            </CustomerBar>
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any familys or members</Alert>}

            {filters}

            {totalCount > 0 && <MyTable
                height={650}
                rows={customers}
                totalRow={totalCount}
                headers={header}
                checkbox={true}
                rowsPerPage={rowsPerPage}
                OpentionComponent={(id, idx) => {
                    return <MemberOptButton
                        onCharge={(id, idx) => handleCharge(id, idx)}
                        onRecharge={(id, idx) => handleRecharge(id, idx)}
                        onEdit={handleEditCustomer}
                        onTransactionHistory={handleTransactionHistory}
                        id={id} index={idx} />
                }}
                onSelected={handleSelected}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
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
export default Accountings