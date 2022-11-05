import MyTable from "../../Component/MyTable"
import {  Alert,  Snackbar, Backdrop,Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { apiResult,  getUserSession,  } from "../../Utils/Common";
import apis from "../../api";
import {  useParams } from "react-router";

const Applicant = ()=>{
    const [loading, setLoading] = useState(false)
    const [hintMsg, setHintMsg] = useState()
    const [applicants, setApplicants] = useState([])
    const [header,setHeader] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [error, setError] = useState()
    const session = getUserSession(apis)
    const params = useParams()
    const handleHintClose = () => {
        setHintMsg()
    }
    const setApplicantsData = (data,event)=>{
        let ret = []
        let headers = event && event.sign == 1 ?[{name:'id',showName:'ID'},{name:'family',showName:'Family'},{name:'femail',showName:'Email'},{name:'fphone',showName:'Phone'}]:[{name:'id',showName:'ID'}]
        
        data.map((item,idx)=>{
            let row = item
            if(event && event.sign == 1 && item.user_profile) {
                row.family = item.user_profile.name
                row.femail = item.user_profile.email
                row.fphone = item.user_profile.phone
            }
            let form = item.form ?JSON.parse(item.form):[]
            form.map(f=>{
                f.items.map(subitem=>{
                    if(idx === 0) headers.push({name:subitem.name,showName:subitem.name})
                    row[subitem.name] = subitem.value && (subitem.type == 'option' ? subitem.value.join(','):(subitem.type == 'check'?(subitem.value?'Yes':''):subitem.value))
                })
            }) 
            ret.push(row)
        })
        if(event && event.pay == 1) {
            headers.push({name:'pay_status',showName:'Pay status',func:(v,idx,row)=>{
                console.log(v)
                if(v == 1) {
                    return <Typography variant="body2">${row.pay_amount}<br></br>{row.pay_time}</Typography>
                }else {
                    return 'Unpaid'
                }
            }})
        }
        return {header:headers,applicants:ret}
    }
    const loadApplicants = (page, pagesize, countData) => {
        setLoading(true)
        apis.loadApplicants(params.id,page, pagesize, countData).then(ret => {
            setLoading(false)
            apiResult(ret, (data) => {
                countData == 1 && setTotalCount(data.total)
                let rr = setApplicantsData(data.data,data.event)
                setApplicants(rr.applicants,rr.event)
                setHeader(rr.header)
                setCurrentPage(page)
            }, setError)
        }).catch(e =>{
            console.log(e)
            setLoading(false)
            setError(e.message)
        })
    }
    let initPage = false
    useEffect(() => {
        if (initPage) return
        initPage = true
        loadApplicants(0, rowsPerPage, 1)
    }, [])
    const handleChangePage = (page, rowsperpage) => {
        //setRowsPerPage(rowsperpage)
        loadApplicants(page, rowsperpage, 0)
    }
    const handleChangeRowsPerPage = (rowsperpage) => {
        setRowsPerPage(rowsperpage)
        loadApplicants(0, rowsperpage, 0)
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
    return (
        <>
            <Backdrop open={loading} />
            {error && <Alert severity={"warning"} sx={{ width: '100%', marginTop: "5px", mb: 2 }} onClose={() => setError()}>{error}</Alert>}
            {totalCount == 0 && <Alert severity={"info"}>Ops! There is not any applicants</Alert>}
            {totalCount > 0 && <MyTable
                height={650}
                rows={applicants}
                totalRow={totalCount}
                headers={header}
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
export default Applicant