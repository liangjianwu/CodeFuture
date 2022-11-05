import MyTable from "../../Component/MyTable"
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, ListItemIcon, ListItemText, Alert, Paper, Toolbar, Typography, Button, Stack, Snackbar, Backdrop } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult, formToJson, getUserSession, sessionSet } from "../../Utils/Common";
import apis from "../../api";
import { RightDrawer } from "../../Component/MuiEx";
import { Delete, Edit } from "@mui/icons-material";
import EditProductForm from './fragement/EditProductForm'
import DownMenuItem from "../member/fragement/DownMenuItem";
import { getBalanceProduct } from "./config";

const Products = () => {
    const [selected, setSelected] = useState([])
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [products, setProducts] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [totalCount, setTotalCount] = useState(0)
    const [error, setError] = useState()
    const [rightDrawer, setRightDrawer] = useState()   //open or close right drawer
    const [autoCloseRightDrawer, setAutoCloseRightDrawer] = useState(true)

    const session = getUserSession(apis)

    const handleHintClose = () => {
        setHintMsg()
    }
    const loadProducts = (page, pagesize, countData) => {
        setLoading(true)
        apis.loadProducts(page, pagesize, countData).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                data.data.map(item => {
                    item.chargeto_label = getBalanceProduct(item.chargeto).label
                    item.coach = item.coach ?item.coach.name:'None'
                })
                setProducts(data.data)
            }, setError)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadProducts(0, rowsPerPage, 1)
    }, [])
    const handleEditProductFormClose = (changed) => {
        setRightDrawer()
        if (changed) {
            loadProducts(0, rowsPerPage, 1)
        }
    }
    const handleAddProduct = () => {
        setRightDrawer(<EditProductForm onClose={handleEditProductFormClose} />)
        setAutoCloseRightDrawer(false)
    }
    const handleRightDrawer = () => {
        autoCloseRightDrawer && setRightDrawer(false)
    }
    const handleSelected = (selects) => {
        setSelected(selects)
    }
    const handleEditProduct = (id, idx) => {
        setAutoCloseRightDrawer(false)
        let product = idx >= 0 ? products[idx] : 0
        if (product === 0) {
            if (selected.length === 1) {
                products.map(p => {
                    if (p.id === selected[0]) {
                        product = p
                    }
                })
            } else {
                return
            }
        }
        if (product === 0) return

        setRightDrawer(<EditProductForm product={product} onClose={handleEditProductFormClose} />)
    }
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadProducts(page, rowsperpage, 0)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        setError()
        loadProducts(0, rowsperpage, 0)
    }
    const removeItemFromList = (ids) => {
        let cc = [...products]
        for (let i = cc.length - 1; i >= 0; i--) {
            if (ids.indexOf(cc[i].id) >= 0) {
                cc.splice(i, 1)
            }
        }
        setProducts(cc)
    }
    const handleRemoveProduct = () => {
        setError()
        apis.removeProduct({ ids: selected }).then(ret => {
            apiResult(ret, (data) => {
                removeItemFromList(selected)
                sessionSet('products', null)
            }, setError)
        })
    }
    const ProductTableHeader = [
        { name: 'name', showName: 'Product' },
        { name: 'coach', showName: 'Coach' },
        { name: 'description', showName: 'Description' },
        { name: 'minutes', showName: 'Minutes' },
        { name: 'price', showName: 'Price' },
        { name: 'chargeto_label', showName: 'Charge' },        
        { name: 'create_time', showName: 'Date' },]
    const OptionButton = [
        { text: "Add", icon: <AddIcon fontSize="small" />, onClick: handleAddProduct },
        { text: "Remove", icon: <Delete fontSize="small" />, onClick: handleRemoveProduct },
        { text: "Edit", icon: <Edit fontSize="small" />, onClick: handleEditProduct },
    ]
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar style={{ paddingLeft: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }}>
                        {OptionButton.map((item, index) => {
                            if (selected.length == 0 && index === 1) return
                            if (selected.length != 1 && index === 2) return
                            return item.subItems ? <DownMenuItem key={index} icon={item.icon} onClick={item.onClick} items={item.subItems} text={item.text} /> :
                                <MenuItem key={index} onClick={item.onClick}>
                                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}<ListItemText>{item.text}</ListItemText>
                                </MenuItem>
                        })}
                    </Stack>
                    <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div" ></Typography>
                </Toolbar>
            </Paper>
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any products, try to add one</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={products}
                totalRow={totalCount}
                headers={ProductTableHeader}
                checkbox={true}
                rowsPerPage={rowsPerPage}
                OpentionComponent={(id, idx) => { return <Edit onClick={() => handleEditProduct(id, idx)} sx={{ cursor: 'pointer' }} /> }}
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
export default Products