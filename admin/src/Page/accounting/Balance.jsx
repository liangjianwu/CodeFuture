import MyTable from "../../Component/MyTable"
import { Alert, Button, Chip, Snackbar, Backdrop, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, getUserSession, } from "../../Utils/Common";
import apis from "../../api";
import { MemberLevel, MemberStatus, RightDrawer } from "../../Component/MuiEx";
import Recharge from "./fragement/NewRecharge";
import { useNavigate } from "react-router";
import FamilyOptButton from "./fragement/FamilyOptButton";
import {FamilyBar} from "./fragement/FamilyBar";
import MemberEditForm from "../member/fragement/MemberEditForm";

const Balance = () => {
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [customers, setCustomers] = useState([])
    const [filters, setFilters] = useState()
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [currentQuery, setCurrentQuery] = useState()
    //const [balances,setBalances] = useState(0)    
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
    const handleOrder = (item) => {
        const neworder = orderField.order == 'desc' ? 'asc' : 'desc'
        setOrderField({ ...orderField, name: item.name, order: neworder })
        currentQuery && currentQuery.action == 'loadMembers' && loadData(0, rowsPerPage, item.name, neworder)
    }
    const [orderField, setOrderField] = useState({ fields: ['id', 'parent', 'balance'], name: 'id', order: 'desc' })
    const handleHintClose = () => {
        setHintMsg()
    }

    const loadMembers = (page, pagesize, countData, field, order) => {
        setLoading(true)
        apis.loadFamilys(page, pagesize, countData, field, order).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                setCustomerData(data.data, data.members,data.balances)
                //setBalances(data.balances)
                setCurrentQuery({ action: 'loadMembers' })
                setCurrentPage(page)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadMembers(0, rowsPerPage, 1, 'id', 'desc')
    }, [])

    const handleRightDrawer = () => {
        autoCloseRightDrawer && setRightDrawer(false)
    }
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadData(page, rowsperpage, orderField.name, orderField.order)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        setError()
        loadData(0, rowsperpage, orderField.name, orderField.order)
    }
    const loadData = (page, rowsperpage, field, order) => {
        currentQuery && currentQuery.action == 'loadMembers' && loadMembers(page, rowsperpage, 0, field, order)
        currentQuery && currentQuery.action == 'searchCustomers' && searchCustomers(currentQuery.p1, page, rowsperpage, 0)
    }
    const handleAddKid = (id) => {
        setRightDrawer(<MemberEditForm user_id={id} onClose={(ret) => {
            setRightDrawer()
            if (ret) {
                setHintMsg("Succeed to add kid")
                loadData(currentPage, rowsPerPage, orderField.name, orderField.order)
            }
        }} />)
    }
    const handleRecharge = (id, idx) => {
        setRightDrawer(<Recharge familyid={id} onClose={(ret) => { setRightDrawer(); ret && loadData(currentPage, rowsPerPage, orderField.name, orderField.order) }} />)
    }

    const setCustomerData = (data, members,balances) => {
        const items = []
        const hh = [
            { name: 'id', showName: 'ID' },
            {
                name: 'parent', showName: 'Family', func: (v, idx, row) => {
                    return <div style={{ cursor: 'pointer' }} onClick={() => {
                        window.open('/accounting/orders/' + row.user_id + '/0', '_axis_fencing_club_order')
                    }}>{v}</div>
                }
            },
            { name: 'phone', showName: 'Phone' },
            {
                name: 'members', showName: 'Members', func: (v, idx, row) => {
                    if (v.length > 0) {
                        return <div>
                            {v.map((k, i) => {
                                const { icon, status } = MemberStatus(k.status)
                                const { color, level,label } = MemberLevel(k.level)
                                return <Chip title={level+"-"+status} label={label+"-" + k.name} icon={icon} sx={{ m: "2px", borderColor: '#0001' }} size="small" variant="outlined" onClick={() => { 
                                     window.open("/accounting/orders/" + row.id + "/" + k.id, '_axis_fencing_club_order')
                                }} key={i}></Chip>
                            })}
                        </div>
                    } else {
                        return <Button onClick={() => handleAddKid(row.id)}>Add</Button>
                    }
                }
            },
        ]
        data.map(item => {
            let d = { id: item.id, parent: item.user_profile.name, user_id: item.user_profile.user_id, phone: item.user_profile.phone, members: [], balance: item.user_balance?.balance }
            members.map(b => {
                if (b.user_id == item.id) {
                    d.members.push({ id: b.id, name: b.name, status: b.status,level:b.level })
                }
            })
            balances.map(b=>{
                if(b.user_id == item.id) {
                    d[b.balance_type.type] = b.balance
                    let h = []
                    hh.map(item=>{
                        if(item.name == b.balance_type.type) h.push(item)
                    })
                    if (h.length == 0) {
                        hh.push({ name: b.balance_type.type, showName: b.balance_type.type,func:(v)=>{                        
                            if(Number(v)<100) {
                                return <span style={{color:'red'}}>{v}</span>
                            }else {
                                return <span style={{color:'green'}}>{v}</span>
                            }
                        } })
                    }        
                }
            })
            items.push(d)
        })        
        setHeader(hh)
        setCustomers(items)
    }
    const setSearchData = (data) => {
        const items = []
        const hh = [
            { name: 'id', showName: 'ID' },
            {
                name: 'parent', showName: 'Family', func: (v, idx, row) => {
                    return <div style={{ cursor: 'pointer' }} onClick={() => {
                        window.open('/accounting/orders/' + row.user_id + '/0', '_axis_fencing_club_order')
                    }}>{v}</div>
                }
            },
            { name: 'phone', showName: 'Phone' },
            {
                name: 'members', showName: 'Kids', func: (v, idx, row) => {
                    if (v.length > 0) {
                        return <div>
                            {v.map((k, i) => {
                                const { icon, status } = MemberStatus(k.status)
                                return <Chip title={status} label={k.name} icon={icon} sx={{ m: "2px", borderColor: '#0001' }} size="small" variant="outlined" onClick={() => {
                                    window.open("/accounting/orders/" + row.id + "/" + k.id, '_axis_fencing_club_order')
                                }} key={i}></Chip>
                            })}
                        </div>
                    } else {
                        return <Button onClick={() => handleAddKid(row.id)}>Add</Button>
                    }
                }
            },
            { name: 'balance', showName: 'Balance' },
        ]
        data.map(item => {
            let d = { id: item.id, parent: item.user_profile.name, user_id: item.user_profile.user_id, phone: item.user_profile.phone, members: [], balance: item.user_balance?.balance }
            item.members.map(b => {
                d.members.push({ id: b.id, name: b.name, status: b.status })
            })
            items.push(d)
        })
        setHeader(hh)
        setCustomers(items)
    }
    const searchCustomers = (value, page, rowperpage, countdata) => {
        setLoading(true)
        apis.familyBalanceSearch(value, page, rowperpage, countdata).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countdata == 1 && setTotalCount(data.total)
                setSearchData(data.data)
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
        searchCustomers(postdata.get('value'), 0, rowsPerPage, 1, orderField.name, orderField.order)
    }
    const handleSwitch = () => {
        navigate("/accounting/mbalance")
    }
    const handleTransactionHistory = (id, idx) => {
        navigate("/accounting/orders/" + id + "/0")
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
    const handleBalanceSnapshot = ()=>{
        apis.snapshotBalance().then(ret=>{
            apiResult(ret,data=>{
                setHintMsg("Snapshot successfully")
            },setError)
        })
    }
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <FamilyBar
                onCustomerSearch={handleCustomerSearch}
                // onSwitch={handleSwitch}
                // balance={balance}
                onSnapshot={handleBalanceSnapshot}
            />
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any familys or members</Alert>}
            {filters}
            {totalCount > 0 && <MyTable
                height={650}
                rows={customers}
                totalRow={totalCount}
                headers={header}
                order={orderField}
                onOrder={handleOrder}
                checkbox={false}
                rowsPerPage={rowsPerPage}
                OpentionComponent={(id, idx) => {
                    return <FamilyOptButton
                        onRecharge={(id, idx) => handleRecharge(id, idx)}
                        onTransactionHistory={handleTransactionHistory}
                        id={id} index={idx} />
                }}
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
export default Balance