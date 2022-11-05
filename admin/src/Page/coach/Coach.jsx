import { Backdrop,Alert,Snackbar } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import apis from "../../api"
import MyTable from "../../Component/MyTable"
import { apiResult, getUserSession } from "../../Utils/Common"

const Coach = () =>{
    const [records,setRecords] = useState()
    const session = getUserSession(apis)
    const [error,setError] = useState()
    const [hintMsg,setHintMsg] = useState()
    const [rowsPerPage, setRowsPerPage] = useState(20)    
    const [totalCount, setTotalCount] = useState(0)
    const params = useParams()
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadCoachTime(0,rowsPerPage,1)
    },[])
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadCoachTime(page, rowsperpage, 0)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        loadCoachTime(0, rowsperpage, 0)
    }
    const loadCoachTime = (page,pagesize,countdata) =>{
        apis.loadCoachTime(params.id,page,pagesize,countdata).then(ret=>{
            apiResult(ret,data=>{
                setRecords(data.data)
                if(countdata == 1) {
                    setTotalCount(data.total)
                }                
            },setError)
        })
    }
    const handleHintClose = ()=>{
        setHintMsg()
    }
    const TableHeader = [
        { name: 'id', showName: 'ID' },
        { name: 'member_name', showName: 'Member' },        
        { name: 'product_name', showName: 'Lession/Product' },
        { name: 'count', showName: 'Duration (min)' },        
        { name: 'order_date', showName: 'Date',func:(d)=>{return new Date(d).toLocaleDateString()} },]

    return (
        <>            
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any data</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={records}
                totalRow={totalCount}
                headers={TableHeader}
                checkbox={false}
                rowsPerPage={rowsPerPage}                
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />}
            {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
                <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
            </Snackbar>}
        </>

    )
}
export default Coach