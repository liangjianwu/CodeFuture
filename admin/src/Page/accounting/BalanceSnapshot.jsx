import MyTable from "../../Component/MyTable"
import { Alert, Button, Chip, Snackbar, Backdrop, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { apiResult, formToJson, getUserSession, } from "../../Utils/Common";
import apis from "../../api";
import { MemberStatus, RightDrawer } from "../../Component/MuiEx";
import { useNavigate } from "react-router";
import FamilyOptButton from "./fragement/FamilyOptButton";
import {BalanceSnapshotBar} from "./fragement/FamilyBar";


const BalanceSnapshot = () => {
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [customers, setCustomers] = useState([])
    const [filters, setFilters] = useState()
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [currentQuery, setCurrentQuery] = useState()
    const snapshot = useRef(new Date().toISOString().substring(0,10))
    const [snapdate,setSnapdate] = useState()
    const [balance,setBalance] = useState(0)
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
        apis.balanceSnapshot(page, pagesize, countData, field, order,snapshot.current).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                setCustomerData(data.data, data.members)
                setBalance(data.balance)
                setSnapdate(data.snap_date)
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
    }

    const setCustomerData = (data, members) => {
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
                                return <Chip title={status} label={k.name} icon={icon} sx={{ m: "2px", borderColor: '#0001' }} size="small" variant="outlined" onClick={() => { 
                                     window.open("/accounting/orders/" + row.id + "/" + k.id, '_axis_fencing_club_order')
                                }} key={i}></Chip>
                            })}
                        </div>
                    }else {
                        return ''
                    }
                }
            },
            {
                name: 'balance', showName: 'Balance', func: (v) => {
                    if (v < 100) {
                        return <span style={{ color: 'red' }}>${v}</span>
                    } else if (v < 200) {
                        return <span style={{ color: 'orange' }}>${v}</span>
                    } else if (v) {
                        return <span style={{ color: 'green' }}>${v}</span>
                    } else {
                        return '-'
                    }
                }
            },
        ]
        data.map(item => {
            let d = { id: item.id, parent: item.user_profile.name, user_id: item.user_profile.user_id, phone: item.user_profile.phone, members: [], balance: item.user_balance_snapshot?.balance }
            members.map(b => {
                if (b.user_id == item.id) {
                    d.members.push({ id: b.id, name: b.name, status: b.status })
                }
            })
            // item.user_balances.map(b => {
            //     d[b.type] = b.balance
            //     let h = []
            //     hh.map(item => {
            //         if (item.name == b.type) h.push(item)
            //     })
            //     if (h.length == 0) {
            //         hh.push({ name: b.type, showName: getBalanceProduct(b.type).label,func:(v)=>{                        
            //             if(Number(v)<100) {
            //                 return <span style={{color:'red'}}>{v}</span>
            //             }else {
            //                 return <span style={{color:'green'}}>{v}</span>
            //             }
            //         } })
            //     }
            // })
            items.push(d)
        })
        setHeader(hh)
        setCustomers(items)
    }
    const handleTransactionHistory = (id, idx) => {
        navigate("/accounting/orders/" + id + "/0")
    }
    const handleSnapdate = (event) => {
        setError()
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postdata = formToJson(data)
        snapshot.current = postdata.snapdate
        loadData(currentPage,rowsPerPage,orderField.name,orderField.order)
    }
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <BalanceSnapshotBar
                //onCustomerSearch={handleCustomerSearch}
                // onSwitch={handleSwitch}
                onSubmit = {handleSnapdate}
                snapdate = {snapdate}
                balance={balance}
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
                        //onRecharge={(id, idx) => handleRecharge(id, idx)}
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
export default BalanceSnapshot