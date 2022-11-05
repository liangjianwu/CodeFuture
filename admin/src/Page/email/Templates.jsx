import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult,  getUserSession,  } from "../../Utils/Common";
import apis from "../../api";
import TemplateOptButton from "./fragement/TemplateOptButton";
import DownMenuItem from "../member/fragement/DownMenuItem";
import { useNavigate } from "react-router";
const Templates = () => {
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [templates, setTemplates] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [error, setError] = useState()
    const session = getUserSession(apis)
    const navigate = useNavigate()
    const handleHintClose = () => {
        setHintMsg()
    }
    const loadTemplates = (page, pagesize, countData) => {
        setLoading(true)
        apis.loadTemplates(page, pagesize, countData).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                setTemplates(data.data)
                setCurrentPage(page)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadTemplates(0, rowsPerPage, 1)
    }, [])
    const handleAddTemplate = () => {
        navigate('/email/template/0')
    }
    const handleEditTemplate = (id, idx) => {
        navigate('/email/template/' + id)
    }
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadTemplates(page, rowsperpage, 0)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        loadTemplates(0, rowsperpage, 0)
    }
    // const removeItemFromList = (idx) => {
    //     const t = templates[idx]
    //     t && apis.removeTemplate({ id: t.id }).then(ret => {
    //         apiResult(ret, data => {
    //             let cc = [...templates]
    //             cc.splice(idx, 1)
    //             setTemplates(cc)
    //         }, setError)
    //     })
    // }
    const handleRemoveTemplate = (id, idx) => {
        setError()
        window.confirm("Are you sure to delete the template?") && apis.removeTemplate({ id: id }).then(ret => {
            apiResult(ret, (data) => {
                let cc = [...templates]
                cc.splice(idx, 1)
                setTemplates(cc)
            }, setError)
        })
    }
    const handleCloneTemplate = (id, dix) => {
        setError()
        window.confirm("Are you sure to clone the template?") && apis.cloneTemplate({ id: id }).then(ret => {
            apiResult(ret, (data) => {
                let cc = [...templates]
                cc.splice(0,0,data)
                setTemplates(cc)
            }, setError)
        })
    }
    const TemplateTableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'name', showName: 'Template name' },
        { name: 'description', showName: 'Description' },
        { name: 'create_time', showName: 'Date' },]
    const OptionButton = [
        { text: "Add", icon: <AddIcon fontSize="small" />, onClick: handleAddTemplate },
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
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any templates, try to add one</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={templates}
                totalRow={totalCount}
                headers={TemplateTableHeader}
                checkbox={false}
                rowsPerPage={rowsPerPage}
                OpentionComponent={(id, idx) => {
                    return <TemplateOptButton id={id} index={idx}
                        onEdit={(id, idx) => { handleEditTemplate(id, idx) }}
                        onRemove={(id, idx) => { handleRemoveTemplate(id, idx) }}
                        onClone={(id, idx) => { handleCloneTemplate(id, idx) }}
                    />
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />}
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>

    )
}
export default Templates