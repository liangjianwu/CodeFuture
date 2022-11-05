import MyTable from "../../Component/MyTable"
import CustomerBar from "./fragement/CustomerBar";
import { Alert, Typography, Button, Chip, Snackbar, Backdrop } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { apiResult, getUserSession } from "../../Utils/Common";
import apis from "../../api";
import { MemberLevel, MemberLevelOption, MemberStatus, RightDrawer, SingleOptionList, SingleSelector } from "../../Component/MuiEx";
import CustomerOptButton from "./fragement/CustomerOptButton";
import GroupList from "./fragement/GroupList"

import MemberEditForm from "./fragement/MemberEditForm";
import { useNavigate } from "react-router";
import CommonDialog from "../../Component/CommonDialog";

const Members = () => {
    const [selected, setSelected] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentMemberIdx, setCurrentMemberIdx] = useState(-1)
    const [hintMsg, setHintMsg] = useState()
    const [customers, setCustomers] = useState([])
    const [filters, setFilters] = useState()
    const [currentGroup, setCurrentGroup] = useState()
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [totalCount, setTotalCount] = useState(0)
    const [currentQuery, setCurrentQuery] = useState()
    const [error, setError] = useState()
    //const [rightComponent, setRightComponent] = useState()   //right drawer children
    const [rightDrawer, setRightDrawer] = useState()   //open or close right drawer
    const [autoCloseRightDrawer, setAutoCloseRightDrawer] = useState(true)
    const navigate = useNavigate()
    const showOption = useRef(-2)
    const groups = useRef([])
    const handleOrder = (item) => {
        const neworder = orderField.order == 'desc' ? 'asc' : 'desc'
        setOrderField({ ...orderField, name: item.name, order: neworder })
        currentQuery && currentQuery.action == 'loadCustomers' && loadCustomer(0, rowsPerPage, 0, item.name, neworder)
    }
    const [orderField, setOrderField] = useState({ fields: ['id', 'name', 'birthday', 'level'], name: 'id', order: 'desc' })
    getUserSession(apis)
    // const createData = (id, membership, name, city, province, create_time) => {
    //     return { id, membership, name, city, province, create_time }
    // }

    const handleHintClose = () => {
        setHintMsg()
    }
    const getGroupInfo = (_groups) => {
        let rg = []
        _groups.map(g => {
            groups.current.map(_g => {
                if (g.group_id == _g.id) {
                    rg.indexOf(_g.name) < 0 && rg.push({ id: _g.id, name: _g.name, group: _g })
                }
            })
        })
        return rg
    }
    const loadCustomer = (page, pagesize, countData, orderfield, order) => {
        setLoading(true)
        apis.loadCustomer(page, pagesize, countData, showOption.current, orderfield, order).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData === 1 && setTotalCount(data.total)
                customers.length > 0 && setHintMsg('Loaded data successfully')
                groups.current = data.group?data.group:[]
                data.data.map(c => {
                    c.parent = c.user_profile ? c.user_profile.name : ''
                    c.parent_phone = c.user_profile ? (c.user_profile.phone) : ''
                    c.parent_email = c.user_profile ? (c.user_profile.email) : ''
                    c.classes = c.member_groups ? getGroupInfo(c.member_groups) : []
                    return true
                })
                setCustomers(data.data)
                setCurrentQuery({ action: 'loadCustomers' })
                setSelected([])
            }, setError)
        })
    }

    useEffect(() => {
        loadCustomer(0, rowsPerPage, 1, 'id', 'desc')
    }, [])
    const handleEditCustomerFormClose = (changed) => {
        setRightDrawer()
        if (changed) {
            loadCustomer(0, rowsPerPage, 1, orderField.name, orderField.order)
        }
    }
    // const handleAddCustomer = () => {
    //     setRightDrawer(<MemberEditForm id={0} onClose={handleEditCustomerFormClose} />)
    //     setAutoCloseRightDrawer(false)
    // }
    const handleRightDrawer = () => {
        autoCloseRightDrawer && setRightDrawer(false)
    }
    const handleSelected = (selects) => {
        setSelected(selects)

    }
    // const handleCustomerDetailClose = (changed) => {
    //     setRightDrawer()
    // }
    const handleCustomerDetail = (id, idx) => {
        // setAutoCloseRightDrawer(false)
        // setRightDrawer(<CustomerDetail onClose={handleCustomerDetailClose} />)
        navigate('/accounting/orders/' + customers[idx].user_id + "/" + id)
    }
    const handleEditCustomer = (id, idx) => {
        setAutoCloseRightDrawer(false)
        setRightDrawer(<MemberEditForm id={id} onClose={handleEditCustomerFormClose} />)
    }
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        currentQuery.action === 'loadCustomers' && loadCustomer(page, rowsperpage, 0, orderField.name, orderField.order)
        currentQuery.action === 'filterByGroup' && filterByGroup(currentQuery.p1, currentQuery.p2, page, rowsperpage, 0)
        currentQuery.action === 'searchCustomers' && searchCustomers(currentQuery.p1, page, rowsperpage, 0)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        setError()
        currentQuery.action === 'loadCustomers' && loadCustomer(0, rowsperpage, 0, orderField.name, orderField.order)
        currentQuery.action === 'filterByGroup' && filterByGroup(currentQuery.p1, currentQuery.p2, 0, rowsperpage, 0)
        currentQuery.action === 'searchCustomers' && searchCustomers(currentQuery.p1, 0, rowsperpage, 0)
    }
    const filterByGroup = (id, groups, page, rowperpage, countdata) => {
        if (id > 0) {
            setLoading(true)
            apis.getGroupCustomers(id, page, rowperpage, countdata, showOption.current).then(ret => {
                setLoading(false)
                apiResult(ret, (data) => {
                    if (groups && groups.length > 0) {
                        let ss = ''
                        groups.map(group => {
                            ss += group.name + '  '
                        })
                        ss = ss.length > 20 ? (ss.substring(0, 20) + '...') : ss
                        setFilters(<Chip sx={{ marginBottom: 1 }} label={ss} variant="outlined" onDelete={() => { setFilters(); setCurrentGroup(); loadCustomer(0, rowsPerPage, 1, orderField.name, orderField.order) }} />)
                        if (groups.length === 1) {
                            setCurrentGroup(groups[0])
                        } else {
                            setCurrentGroup()
                        }
                    }
                    data.data.map(c => {
                        c.parent = c.user_profile ? c.user_profile.name : ''
                        c.parent_phone = c.user_profile ? (c.user_profile.phone) : ''
                        c.parent_email = c.user_profile ? (c.user_profile.email) : ''
                        c.classes = c.member_groups ? getGroupInfo(c.member_groups) : []
                    })
                    setCustomers(data.data)
                    if (countdata == 1) {
                        setTotalCount(data.total)
                    }
                    setHintMsg('Loaded data successfully')
                    setCurrentQuery({ action: 'filterByGroup', p1: id, p2: groups })
                }, setError)
            })

        }
    }
    const handleFilterByGroup = () => {
        setRightDrawer(<GroupList showgroup={true} onClose={
            (id, groups) => { setError(); id && filterByGroup(id, groups, 0, rowsPerPage, 1); setRightDrawer() }
        } multiple={false} />)
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
    const handleDormantFromGroup = () => {
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
    const searchCustomers = (value, page, rowperpage, countdata) => {
        setLoading(true)
        apis.customerSearch(value, page, rowperpage, countdata, showOption.current).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                (countdata == 1) && setTotalCount(data.total)
                data.data.map(c => {
                    c.parent = c.user_profile ? c.user_profile.name : ''
                    c.parent_phone = c.user_profile ? (c.user_profile.phone) : ''
                    c.parent_email = c.user_profile ? (c.user_profile.email) : ''
                    c.classes = c.member_groups ? getGroupInfo(c.member_groups) : []
                })
                setCustomers(data.data)
                setFilters(<Chip sx={{ marginBottom: 1 }} label={value} variant="outlined" onDelete={() => { setFilters(); loadCustomer(0, rowsPerPage, 1, orderField.name, orderField.order) }} />)
                setCurrentQuery({ action: 'searchCustomers', p1: value })
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
    const changeStatus = (id, status, idx) => {
        apis.changeMemberStatus(id, status).then(ret => {
            apiResult(ret, data => {
                let cc = [...customers]
                cc[idx].status = status
                setCustomers(cc)
            }, setError)
        })
    }
    const handleNonMember = (id, idx) => {
        changeStatus(id, 0, idx)
    }
    const hanleMember = (id, idx) => {
        changeStatus(id, 1, idx)
    }
    const handleTempMember = (id, idx) => {
        changeStatus(id, 2, idx)
    }
    const handleDormant = (id, idx) => {
        changeStatus(id, 3, idx)
    }
    const handleShowOption = (name, value) => {
        showOption.current = value
        currentQuery.action === 'loadCustomers' && loadCustomer(0, rowsPerPage, 1, orderField.name, orderField.order)
        currentQuery.action === 'filterByGroup' && filterByGroup(currentQuery.p1, currentQuery.p2, 1, rowsPerPage, 0)
        currentQuery.action === 'searchCustomers' && searchCustomers(currentQuery.p1, 0, rowsPerPage, 1)
    }

    const CustomerTableHeader = [
        { name: 'id', showName: 'ID' },
        {
            name: 'create_time', showName: 'Member ID', func: (v, idx, row) => {
                if (row.status > 0) {
                    let n = 1000 + Number(row.id)
                    return "1" + (row.gender == 'Male' ? "1" : "0") + ((row.birthday && row.birthday != null) ? row.birthday.substring(0, 4) : '0000') + n
                } else {
                    return ''
                }
            }
        },
        {
            name: 'name', showName: 'Member', func: (v, idx, row) => {
                const { icon, status } = MemberStatus(row.status)
                return <Chip size="small" variant="outlined" title={status} icon={icon} label={v} sx={{ m: "1px", border: "0px" }} />
            }
        },
        // {
        //     name: 'level', showName: 'Level', func: (v, idx, row) => {
        //         const { level, color } = MemberLevel(row.level)
        //         return <Chip size="small" variant="outlined" title={level} onClick={() => {
        //             setCurrentMemberIdx(idx)
        //         }} label={level} sx={{ m: "1px", color: color }} />
        //     }
        // },
        {
            name: 'classes', showName: 'Group', func: (v, idx, row) => {
                return <>
                    {v.map(c => {
                        return <Chip size="small" variant="outlined" title={c.name} onClick={() => {
                            filterByGroup([c.id], [c.group], 0, 20, 1)
                        }} label={c.name} sx={{ m: "1px", }} />
                    })}
                </>
            }
        },

        // { name: 'gender', showName: "Gender" },
        { name: 'birthday', showName: "Birthday" },
        {
            name: 'birthday1', showName: "Age", func: (v, idx, row) => {
                return row.birthday && row.birthday.length > 0 ? (Number(new Date().getFullYear()) - Number(new Date(row.birthday).getFullYear())) : ''
            }
        },
        { name: 'parent', showName: 'Family' },
        { name: 'parent_phone', showName: 'Parent phone' },
        // { name: 'parent_email', showName: 'Parent email' },

        // {
        //     name: 'create_time', showName: 'Date', func: (v) => {
        //         return new Date(v).toLocaleDateString()
        //     }
        // },
    ]
    // const OptionButton = [
    //     {
    //         text: "", icon: <AddIcon fontSize="small" />, subItems: [
    //             { text: "Greate group", icon: <AddIcon fontSize="small" />, onClick: handleCreateGroup },
    //             { text: 'Add Customer', icon: <AddIcon fontSize="small" />, onClick: handleAddCustomer },
    //             { text: 'Import from file', icon: <UploadFileIcon fontSize="small" />, onClick: handleImportCustomerFile },
    //         ]
    //     },
    // ]
    return (
        <>
            {loading && <Backdrop />}
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <CustomerBar
                onFilterByGroup={handleFilterByGroup}
                onCustomerSearch={handleCustomerSearch}
                onCloseSecondBar={handleCloseSecondBar}
                onShowOption={handleShowOption}
            >{selected && selected.length > 0 && <>
                <Button variant="contained" size="small" onClick={handleAddToGroup} sx={{ ml: 2, fontSize: 12, cursor: 'hand' }} > Group</Button>
                {currentGroup && <Button variant="outlined" size='small' onClick={handleDormantFromGroup} sx={{ ml: 2, fontSize: 12, width: 200, cursor: 'hand' }} >
                    Remove from group
                </Button>}                
            </>}
            </CustomerBar>
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any memebrs</Alert>}

            {filters}

            {totalCount > 0 && <MyTable
                height={650}
                rows={customers}
                totalRow={totalCount}
                headers={CustomerTableHeader}
                checkbox={true}
                rowsPerPage={rowsPerPage}
                order={orderField}
                onOrder={handleOrder}
                OpentionComponent={(id, idx) => {
                    return <CustomerOptButton
                        onDetail={handleCustomerDetail}
                        onEdit={handleEditCustomer}
                        onNonMember={handleNonMember}
                        onMember={hanleMember}
                        onTempMember={handleTempMember}
                        onDormant={handleDormant}
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
            {currentMemberIdx >= 0 && <CommonDialog errorHint={error} dialogTitle={"Change member level"} onClose={() => setCurrentMemberIdx(-1)}>
                <Typography gutterBottom>
                    Change member level to:
                </Typography>
                <SingleOptionList defaultValue={customers[currentMemberIdx].level} items={MemberLevelOption().levels} values={MemberLevelOption().values} name="level" onChange={(n, v) => {
                    apis.changeMemberLevel(customers[currentMemberIdx].id, v).then(ret => {
                        setError()
                        apiResult(ret, data => {
                            setCurrentMemberIdx(-1)
                            let cc = [...customers]
                            cc[currentMemberIdx].level = v
                            setCustomers(cc)
                        }, setError)
                    })
                }}></SingleOptionList>
            </CommonDialog>}
        </>

    )
}
export default Members